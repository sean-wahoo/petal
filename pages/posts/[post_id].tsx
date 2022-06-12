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
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { useSession } from "lib/useSession";

const PostPage: NextPage<PostPageProps> = ({ post }) => {
  const [session, setSession] = useState<SessionData | undefined>();
  useEffect(() => {
    setSession(useSession())
  }, []);

  const [loading, setLoading] = useState<boolean>(!post);
  const current_user_rate_data = useMemo(() => {
    return post?.rated_post.find(rate => rate.user_rate_id === session?.user_id);
  }, [post, session]);

  const editor = useEditor({
    editable: false,
    content: post?.content,
    extensions: [StarterKit],
  });

  useEffect(() => {
    if (post) {
      setLoading(false);
      if (editor?.commands) editor?.commands?.setContent(post?.content);
    }
  }, [post]);

  let { data: comments, error: comments_error } = useSWR(
    `${getApiUrl()}/api/comments/${post?.post_id}`,
    fetcher
  );
  if (comments_error) console.error(comments_error);

  const onUp = async () => {
    const session = useSession()
    // const current_user_rate_data = post?.rated_post.find(rate => {
    //   return rate.user_rate_id === session?.user_id;
    // })
    const [data, error] = await resolver(axios.post(`${getApiUrl()}/api/rates/post-rate`, {
      rate_kind: 'up',
      user_rate_id: session?.user_id,
      post_rate_id: post?.post_id,
      remove_rate: current_user_rate_data?.rate_kind === 'up'
    }))
    console.log({ data, error })
  }
  const onDown = async () => {
    const session = useSession()
    // const current_user_rate_data = post?.rated_post.find(rate => {
    //   return rate.user_rate_id === session?.user_id;
    // })
    const [data, error] = await resolver(axios.post(`${getApiUrl()}/api/rates/post-rate`, {
      rate_kind: 'down',
      user_rate_id: session?.user_id,
      post_rate_id: post?.post_id,
      remove_rate: current_user_rate_data?.rate_kind === 'down'
    }))
    console.log({ data, error })
  }

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
            onUp={() => onUp()}
            onDown={() => onDown()}
            loading={loading}
            isUp={current_user_rate_data?.rate_kind === 'up'}
            isDown={current_user_rate_data?.rate_kind === 'down'}
            numUps={post?.rated_post.filter(rate => rate.rate_kind === 'up').length}
            numDowns={post?.rated_post.filter(rate => rate.rate_kind === 'down').length}
          />
          <section className={styles.comments_section}>
            <CreateComment
              session={session}
              parent_id={post?.post_id as string}
            />
            {!comments
              ? [...Array(12).keys()].map((_, i) => (
                <Comment loading={true} key={i} session={session as SessionData} />
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
