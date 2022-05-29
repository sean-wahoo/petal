import Layout from "components/Layout";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import styles from "styles/layouts/profile.module.scss";
import type { ProfilePageProps, SessionData } from "lib/types";
import { getApiUrl } from "lib/utils";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "lib/useSession";

const ProfilePage: NextPage<ProfilePageProps> = ({ profile_data }) => {
  const [session, setSession] = useState<SessionData | undefined>();
  useEffect(() => {
    const s = useSession();
    setSession(s);
  }, []);
  return (
    <Layout
      session={session}
      title={`${profile_data.display_name} - ConnectHigh`}
      is_auth={true}
    >
      <main className={styles.profile_page}>
        <article className={styles.user_info}>
          <section>
            <Image
              className={styles.profile_image}
              width={196}
              height={196}
              src={profile_data.image_url}
            />
            <div>
              <h1 className={styles.display_name}>
                {profile_data.display_name}
              </h1>
              <p className={styles.tagline}>{profile_data.tagline}</p>
            </div>
          </section>
          <nav className={styles.button_row}></nav>
        </article>
      </main>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { user_id }: any = context.params;
  let { data: profile_data } = await axios.get(
    `${getApiUrl()}/api/users/get-user?user_id=${user_id}`
  );
  return {
    props: { profile_data },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: user_ids } = await axios.get(
    `${getApiUrl()}/api/users/get-user-ids`
  );
  const paths = user_ids.map((x: any) => {
    return { params: { user_id: x.user_id } };
  });
  return {
    paths,
    fallback: false,
  };
};

export default ProfilePage;
