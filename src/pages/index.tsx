import styles from "src/styles/layouts/index.module.scss";
import Layout from "src/components/Layout";
import { Suspense } from "react";
import { LoadingPostCard } from "src/components/PostCard";
import dynamic from "next/dynamic";
import { trpc } from "src/utils/trpc";

const PostCard = dynamic(() => import("src/components/PostCard"), {
  suspense: true,
});

const Index = () => {
  const posts = trpc.useQuery(["post.getAll"]);

  const cards = posts.isLoading
    ? [...Array(12).keys()].map((_, i) => <LoadingPostCard key={i} />)
    : posts.data?.map((post, i) => {
        return <PostCard key={i} post={post} />;
      });

  return (
    <Layout title="Petal - Home" is_auth={true}>
      <main className={styles.index}>
        <Suspense
          fallback={[...Array(12).keys()].map((_, i) => (
            <LoadingPostCard key={i} />
          ))}
        >
          {cards}
        </Suspense>
      </main>
    </Layout>
  );
};

export default Index;
