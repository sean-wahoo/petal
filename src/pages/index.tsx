import type { PostProps } from "src/lib/types";
import styles from "styles/layouts/index.module.scss";
import Layout from "src/components/Layout";
import { fetcher } from "src/lib/promises";
import { getApiUrl } from "src/lib/utils";
import useSWR from "swr";
import { Suspense } from "react";
import { LoadingPostCard } from "src/components/PostCard";
import dynamic from "next/dynamic";

const PostCard = dynamic(() => import("src/components/PostCard"), {
  suspense: true,
});

const Index = () => {
  const { data: posts, error: posts_error } = useSWR(
    `${getApiUrl()}/api/posts/get-posts`,
    fetcher,
    { suspense: true }
  );

  return (
    <Layout title="Petal - Home" is_auth={true}>
      <main className={styles.index}>
        <Suspense
          fallback={[...Array(12).keys()].map((_, i) => (
            <LoadingPostCard key={i} />
          ))}
        >
          {posts.map((post: PostProps) => {
            return <PostCard key={post.postId} post={post} />;
          })}
        </Suspense>
      </main>
    </Layout>
  );
};

export default Index;
