import Layout from "components/Layout";
import { NextPage, GetServerSideProps } from "next";
import styles from "styles/layouts/profile.module.scss";
import type { ProfilePageProps } from "lib/types";
import { getApiUrl, session_check } from "lib/utils";
import axios from "axios";
import Image from "next/image";

const ProfilePage: NextPage<ProfilePageProps> = ({ profile_data, session }) => {
  return (
    <Layout
      session_data={session}
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

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const [session, error] = await session_check(context.req, context.res);
  if (error) return error;
  try {
    let { data: profile_data } = await axios.get(
      `${getApiUrl()}/api/users/profile-data/${context.query.user_id}`
    );

    return {
      props: { session, profile_data },
    };
  } catch (e: any) {
    if (e.response.data.error_message === "user-not-found") {
      return {
        notFound: true,
      };
    }
  }
};

export default ProfilePage;
