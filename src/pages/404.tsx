import { useRouter } from "next/router";
import Layout from "src/components/Layout";
import styles from "src/styles/layouts/custom404.module.scss";

const Custom404 = () => {
  const router = useRouter();
  return (
    <Layout title="Petal - Page not found">
      <main className={styles.custom404}>
        <h1>We couldn't find what you were looking for!</h1>
        <button onClick={() => router.back()}>
          Back to the land of the living
        </button>
      </main>
    </Layout>
  );
};

export default Custom404;
