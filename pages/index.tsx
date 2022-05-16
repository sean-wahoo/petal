import type { NextPage, GetServerSideProps } from "next";
import type { SessionProps, SessionError, SessionSuccess } from "lib/types";
import styles from "styles/layouts/index.module.scss";
import { session_handler } from "lib/session";
import Layout from "components/Layout";

const Index: NextPage<SessionProps> = ({ session }) => {
  return (
    <Layout session_data={session} title="Home - Petal" is_auth={true}>
      <main className={styles.index}></main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  let session: SessionSuccess | SessionError | Object = {};
  try {
    session = await session_handler(context.req.cookies.session_id);
    return {
      props: { session },
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
