import Layout from "components/Layout";
import { SessionData, SessionProps } from "lib/types";
import { useSession } from "lib/useSession";
import { NextPage } from "next";
import { useState } from "react";
import styles from "styles/layouts/welcome.module.scss";

const Welcome: NextPage<SessionProps> = () => {
  const { session, updateSession } = useSession();
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
      Start with choosing a few <i>topics</i> you&apos;re interested in and make
      your first <i>post</i>!
    </p>,
  ];

  const pages = () => {
    return headerText.map((_, i) => {
      return (
        <span
          className={i === pageNum ? styles.on_page : ""}
          key={i}
          onClick={() => {
            setPageNum(i);
            i === 2 && setCompleted(true);
          }}
        />
      );
    });
  };
  const handleContinue: () => void = async () => {
    try {
      await fetch(`/api/users/welcome-user?user_id=${session?.user_id}`, {
        method: "PATCH",
      });
      updateSession({ ...(session as SessionData), been_welcomed: true });
    } catch (e: any) {
      console.error({ e });
    }
  };
  return (
    <Layout title="Petal - Welcome" is_auth={true} showNavbar={false}>
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

export default Welcome;
