import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CreateComment from "components/CreateComment";
import Layout from "components/Layout";
import RateButtons from "components/RateButtons";
import { fetcher } from "lib/promises";
import { PostPageProps } from "lib/types";
import { getApiUrl, getFormattedTimestamp } from "lib/utils";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import styles from "styles/layouts/post_page.module.scss";
import { LoadingComment } from "components/Comment";
import { Suspense, useEffect } from "react";
import useSWR from "swr";
import { PrismaClient } from "@prisma/client";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const PostPage: NextPage<PostPageProps> = ({ post }) => {
  const { data: session } = useSession();

  const Comment = dynamic(() => import("components/Comment"), {});
  const editor = useEditor({
    editable: false,
    content: post.content,
    extensions: [StarterKit],
  });

  useEffect(() => {
    if (!editor?.isDestroyed) {
      editor?.commands?.setContent(post.content);
    }
  }, [post]);

  let { data: comments, error: comments_error } = useSWR(
    `${getApiUrl()}/api/comments/${post.postId}`,
    fetcher,
    { suspense: true }
  );
  if (comments_error) console.error(comments_error);

  return (
    <Layout title={`Petal - ${post?.title}`} is_auth={true}>
      <main className={styles.post_page}>
        <article className={styles.post_info}>
          <header className={styles.header}>
            <h2>{post.title}</h2>
            <h6>
              by {post.author.name} · {getFormattedTimestamp(post.createdAt)}
            </h6>
          </header>
          <div className={styles.content}>
            <EditorContent editor={editor} />
          </div>
          {session && (
            <RateButtons
              commentId={post.postId}
              id={session.user?.id as string}
              rateInfo={post.ratedPost}
            />
          )}
          <section className={styles.comments_section}>
            <CreateComment parentId={post.postId} />
            <Suspense
              fallback={[...Array(12).keys()].map((_, i) => (
                <LoadingComment key={i} />
              ))}
            >
              {comments.map((comment: any, i: number) => {
                return <Comment key={i} comment={comment} />;
              })}
            </Suspense>
          </section>
        </article>
      </main>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { postId }: any = context.params;
  const prisma = new PrismaClient();
  let post = await prisma.post.findUnique({
    select: {
      postId: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
      title: true,
      content: true,
      ups: true,
      downs: true,
      createdAt: true,
      updatedAt: true,
      ratedPost: true,
    },
    where: {
      postId: postId as string,
    },
  });

  post = JSON.parse(JSON.stringify(post));

  prisma.$disconnect();
  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const prisma = new PrismaClient();
  const post_ids = await prisma.post.findMany({
    select: {
      postId: true,
    },
  });
  const paths = post_ids.map((x: any) => {
    return { params: { postId: x.postId } };
  });

  prisma.$disconnect();
  return {
    paths,
    fallback: "blocking",
  };
};

export default PostPage;
