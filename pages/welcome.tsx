import axios from "axios";
import Layout from "components/Layout";
import { resolver } from "lib/promises";
import { session_handler } from "lib/session";
import { SessionError, SessionProps, SessionSuccess } from "lib/types";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "styles/layouts/welcome.module.scss";

const Welcome: NextPage<SessionProps> = ({ session }) => {
  const [pageNum, setPageNum] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const headerText = [
    <h1 key="h-1" className={styles.header_text}>
      Welcome to <i>Petal</i>
    </h1>,
    <h1 key="h-2" className={styles.header_text}>
      With <i>Petal</i>, you can...
    </h1>,
    <h1 key="h-3" className={styles.header_text}>
      Post on <i>Petal</i>!
    </h1>,
  ];
  const bodyText = [
    <p key="b-1" className={styles.body_text}>
      Petal is an online social environment where you can involve yourself in
      the <i>topics</i> you love and be part of a rich <i>community</i> of
      individuals.
    </p>,
    <ul key="b-2" className={styles.body_text}>
      <li>
        Make <i>posts</i> to engange with <i>topics</i>, <i>communities</i>, and
        other users
      </li>
      <li>
        Hang out with your friends in public or private <i>rooms</i>
      </li>
      <li>Meet new people who share your interests</li>
    </ul>,
    <p key="b-3" className={styles.body_text}>
      Start with choosing a few <i>topics</i> you're interested in and make your
      first <i>post</i>!
    </p>,
  ];

  const pages = () => {
    return headerText.map((x, i) => {
      return (
        <span
          className={i === pageNum ? styles.on_page : ""}
          onClick={() => {
            setPageNum(i);
            i === 2 && setCompleted(true);
          }}
        />
      );
    });
  };
  const handleContinue: () => void = async () => {
    await axios.patch(`/api/users/welcome-user?user_id=${session.user_id}`);
    window.location.reload();
  };
  return (
    <Layout title="Welcome - Petal" is_auth={true} showNavbar={false}>
      <main className={styles.welcome}>
        {headerText[pageNum]}
        {bodyText[pageNum]}
        <div className={styles.pages_row}>{pages()}</div>
        {completed && (
          <span className={styles.continue} onClick={handleContinue}>
            Continue →
          </span>
        )}
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let session: SessionSuccess | SessionError;
  try {
    session = (await session_handler(
      context.req.cookies.session_id
    )) as SessionSuccess;
    const [data, error] = await resolver(
      axios.get(
        `http://localhost:3000/api/users/get-user?user_id=${session.user_id}`
      )
    );
    if (error) throw { message: error.message, code: error.code };
    if (data.been_welcomed) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: { session, user_data: data },
    };
  } catch (e: any) {
    console.error({ e });
    context.res.setHeader("Set-Cookie", ["session_id=deleted; Max-Age=0"]);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

export default Welcome;
