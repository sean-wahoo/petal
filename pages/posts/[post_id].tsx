import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CreateComment from "components/CreateComment";
import Layout from "components/Layout";
import RateButtons from "components/RateButtons";
import { fetcher, resolver } from "lib/promises";
import { PostPageProps, SessionData } from "lib/types";
import { getApiUrl, getFormattedTimestamp } from "lib/utils";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import styles from "styles/layouts/post_page.module.scss";
import Comment from "components/Comment";
import { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { useSession } from "lib/useSession";

const PostPage: NextPage<PostPageProps> = ({ post, post_id }) => {
  const [session, setSession] = useState<SessionData | undefined>();
  useEffect(() => {
    const s = useSession();
    setSession(s);
  }, []);

  const [loading, setLoading] = useState<boolean>(!post);

  const editor = useEditor({
    editable: false,
    content: post?.content,
    extensions: [StarterKit],
  });

  useEffect(() => {
    if (post) {
      setLoading(false);
      editor?.commands.setContent(post?.content);
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
            onUp={() => console.log("up!")}
            onDown={() => console.log("down")}
            loading={loading}
          />
          <section className={styles.comments_section}>
            <CreateComment
              session={session}
              parent_id={post?.post_id as string}
            />
            {!comments
              ? [...Array(12).keys()].map(() => (
                  <Comment loading={true} session={session as SessionData} />
                ))
              : comments.map((comment: any) => {
                  return (
                    <Comment
                      loading={!!comments}
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

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   let post, error;
//   try {
//     // [session, error] = await session_check(context.req, context.res);
//     // if (error) throw { message: error.message, code: error.code };
//     const post_id = context.query.post_id;
//     [post, error] = await resolver(
//       axios.get(`${getApiUrl()}/api/comments/${post_id}`)
//     );
//     if (error) throw { message: error.message, code: error.code };
//     return {
//       props: { session: {}, post_id, post },
//     };
//   } catch (e: any) {
//     console.log({ e });
//     return handleMiddlewareErrors(e.code, context);
//   }
// };

export const getStaticProps: GetStaticProps = async (context) => {
  const { post_id }: any = context.params;
  let { data: post } = await axios.get(`${getApiUrl()}/api/posts/${post_id}`);
  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: post_ids } = await axios.get(
    `${getApiUrl()}/api/posts/get-post-ids`
  );
  const paths = post_ids.map((x: any) => {
    return { params: { post_id: x.post_id } };
  });
  return {
    paths,
    fallback: false,
  };
};

export default PostPage;
