import type { NextPage, GetServerSideProps } from "next";
import type { IndexProps, PostProps, SessionData } from "lib/types";
import styles from "styles/layouts/index.module.scss";
import { decodeSessionToken } from "lib/session";
import Layout from "components/Layout";
import { fetcher } from "lib/promises";
import PostCard from "components/PostCard";
import { getApiUrl, handleMiddlewareErrors } from "lib/utils";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useSession } from "lib/useSession";

const Index: NextPage<IndexProps> = () => {
  const [session, setSession] = useState<SessionData | undefined>();
  useEffect(() => {
    const s = useSession();
    setSession(s);
  }, []);

  const { data: posts, error: posts_error } = useSWR(
    `${getApiUrl()}/api/posts/get-posts`,
    fetcher
  );
  if (posts_error) throw posts_error;
  const [loading, setLoading] = useState<boolean>(!posts);

  useEffect(() => {
    setLoading(!posts);
  }, [posts]);
  return (
    <Layout session={session} title="Petal - Home" is_auth={true}>
      <main className={styles.index}>
        {loading
          ? [...Array(12).keys()].map((_, i) => {
              return <PostCard loading={loading} key={i} />;
            })
          : posts.map((post: PostProps) => {
              return (
                <PostCard loading={loading} key={post.post_id} post={post} />
              );
            })}
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  try {
    const session_payload = context.req.cookies.session_payload;
    const session = decodeSessionToken(session_payload);
    return {
      props: { session },
    };
  } catch (e: any) {
    return handleMiddlewareErrors(e.message, context);
  }
};

export default Index;
