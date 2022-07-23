import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CreateComment from "components/CreateComment";
import Layout from "components/Layout";
import RateButtons from "components/RateButtons";
import { fetcher } from "lib/promises";
import { PostPageProps, RateProps, SessionData } from "lib/types";
import { getApiUrl, getFormattedTimestamp } from "lib/utils";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import styles from "styles/layouts/post_page.module.scss";
import Comment from "components/Comment";
import { useEffect } from "react";
import useSWR from "swr";
import { useSession } from "lib/useSession";
import { PrismaClient } from "@prisma/client";

const PostPage: NextPage<PostPageProps> = ({ post }) => {
  const { session } = useSession();

  const editor = useEditor({
    editable: false,
    content: post?.content,
    extensions: [StarterKit],
  });

  useEffect(() => {
    if (post) {
      if (editor?.commands) editor?.commands?.setContent(post?.content);
    }
  }, [post]);

  let { data: comments, error: comments_error } = useSWR(
    `${getApiUrl()}/api/comments/${post?.post_id}`,
    fetcher
  );
  if (comments_error) console.error(comments_error);

  return (
    <Layout session={session} title={`Petal - ${post?.title}`} is_auth={true}>
      <main className={styles.post_page}>
        <article className={styles.post_info}>
          <header className={styles.header}>
            <h2>{post?.title}</h2>
            <h6>
              by {post?.author?.display_name} ·{" "}
              {getFormattedTimestamp(post?.created_at as string)}
            </h6>
          </header>
          <div className={styles.content}>
            {<EditorContent editor={editor} />}
          </div>
          <RateButtons
            comment_id={post?.post_id}
            user_id={session?.user_id as string}
            rate_info={post?.rated_post as RateProps[]}
          />
          <section className={styles.comments_section}>
            <CreateComment
              session={session}
              parent_id={post?.post_id as string}
            />
            {!comments
              ? [...Array(12).keys()].map((_, i) => (
                  <Comment
                    loading={true}
                    key={i}
                    session={session as SessionData}
                  />
                ))
              : comments.map((comment: any, i: number) => {
                  return (
                    <Comment
                      loading={false}
                      key={i}
                      comment={comment}
                      session={session as SessionData}
                    />
                  );
                })}
          </section>
        </article>
      </main>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { post_id }: any = context.params;
  const prisma = new PrismaClient();
  let post = await prisma.posts.findUnique({
    select: {
      post_id: true,
      author: {
        select: {
          user_id: true,
          display_name: true,
        },
      },
      title: true,
      content: true,
      ups: true,
      downs: true,
      created_at: true,
      updated_at: true,
      rated_post: true,
    },
    where: {
      post_id: post_id as string,
    },
  });

  post = JSON.parse(JSON.stringify(post));
  console.log({ post });

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
  const post_ids = await prisma.posts.findMany({
    select: {
      post_id: true,
    },
  });
  const paths = post_ids.map((x: any) => {
    return { params: { post_id: x.post_id } };
  });

  prisma.$disconnect();
  return {
    paths,
    fallback: "blocking",
  };
};

export default PostPage;
