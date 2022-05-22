import type { NextPage, GetServerSideProps } from "next";
import type {
  SessionProps,
  SessionError,
  SessionSuccess,
  IndexProps,
  PostCardProps,
  PostProps,
} from "lib/types";
import styles from "styles/layouts/index.module.scss";
import { session_handler } from "lib/session";
import Layout from "components/Layout";
import { resolver } from "lib/promises";
import axios from "axios";
import PostCard from "components/PostCard";
import { getApiUrl } from "lib/utils";

const Index: NextPage<IndexProps> = ({ session, posts }) => {
  return (
    <Layout session_data={session} title="Home - Petal" is_auth={true}>
      <main className={styles.index}>
        {posts.map((post: PostProps) => {
          return <PostCard key={post.post_id} post={post} />;
        })}
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  let session: SessionSuccess | SessionError | Object = {};
  try {
    session = await session_handler(context.req.cookies.session_id);
    const [data, error] = await resolver(
      axios.get(`${getApiUrl()}/api/posts/get-posts`)
    );
    if (error) throw error;
    return {
      props: { session, posts: data },
    };
  } catch (e: any) {
    context.res.setHeader("Set-Cookie", ["session_id=deleted; Max-Age=0"]);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

export default Index;
