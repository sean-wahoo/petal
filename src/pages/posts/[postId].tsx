import { Content, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CreateComment from "src/components/CreateComment";
import Layout from "src/components/Layout";
import RateButtons from "src/components/RateButtons";
import { getFormattedTimestamp } from "src/utils/helpers";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import styles from "src/styles/layouts/post_page.module.scss";
import { LoadingComment } from "src/components/Comment";
import { useEffect } from "react";
import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import Comment from "src/components/Comment";
import { prisma } from "src/utils/prisma";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "src/server/_app";
import { trpc } from "src/utils/trpc";

export interface PostProps {
  postId: string;
  author: {
    id: string;
    name: string;
  };
  title: string;
  content: Prisma.JsonValue;
  ups: number;
  downs: number;
  createdAt: Date;
  updatedAt: Date;
  ratedPost: {
    rateKind: string;
    userRateId: string;
  }[];
}

const PostPage = ({
  postId,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: session } = useSession();
  const post = trpc.useQuery(["post.byId", { postId }]);

  if (!post.data) return <div>loading...</div>;

  const editor = useEditor({
    editable: false,
    content: post.data?.content as Content,
    extensions: [StarterKit],
  });

  useEffect(() => {
    if (!editor?.isDestroyed) {
      editor?.commands.setContent(post.data?.content as Content);
    }
  }, [post]);

  const c = trpc.useQuery([
    "comment.getByParentId",
    { parentId: post.data.postId },
  ]);

  const comments = c.isLoading
    ? [...Array(12).keys()].map((_, i) => <LoadingComment key={i} />)
    : c.data?.map((comment: any, i: number) => {
        return <Comment key={i} comment={comment} />;
      });
  return (
    <Layout title={`Petal - ${post.data.title}`} is_auth={true}>
      <main className={styles.post_page}>
        <article className={styles.post_info}>
          <header className={styles.header}>
            <h2>{post.data.title}</h2>
            <h6>
              by {post.data.author.name} ·{" "}
              {getFormattedTimestamp(post.data.createdAt.toString())}
            </h6>
          </header>
          <div className={styles.content}>
            <EditorContent editor={editor} />
          </div>
          {session && (
            <RateButtons
              postId={post.data.postId}
              id={session.user?.id as string}
              rateInfo={post.data.ratedPost}
            />
          )}
          <section className={styles.comments_section}>
            <CreateComment parentId={post.data.postId} />
            {comments}
          </section>
        </article>
      </main>
    </Layout>
  );
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ postId: string }>
) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: null,
  });
  const postId = context.params?.postId as string;
  await ssg.fetchQuery("post.byId", { postId });

  return {
    props: {
      trpcState: JSON.parse(JSON.stringify(ssg.dehydrate())),
      postId,
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postIds = await prisma.post.findMany({
    select: {
      postId: true,
    },
  });
  const paths = postIds.map((x: any) => {
    return { params: { postId: x.postId } };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export default PostPage;
