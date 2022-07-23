import type { NextPage } from "next";
import type { IndexProps, PostProps } from "lib/types";
import styles from "styles/layouts/index.module.scss";
import Layout from "components/Layout";
import { fetcher } from "lib/promises";
import PostCard from "components/PostCard";
import { getApiUrl } from "lib/utils";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useSession } from "lib/useSession";

// sean-reichel-chv6-development.vercel.com
const Index: NextPage<IndexProps> = () => {
  const { session } = useSession();

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
              return <PostCard session={session} loading={loading} key={i} />;
            })
          : posts.map((post: PostProps) => {
              return (
                <PostCard
                  session={session}
                  loading={loading}
                  key={post.post_id}
                  post={post}
                />
              );
            })}
      </main>
    </Layout>
  );
};

export default Index;
