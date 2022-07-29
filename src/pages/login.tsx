import styles from "styles/layouts/login.module.scss";
import Layout from "src/components/Layout";
import { GetServerSideProps } from "next";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import { useRouter } from "next/router";

export default function Login({
  providers,
}: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>) {
  const router = useRouter();
  const { callbackUrl } = router.query;
  return (
    <Layout title="Petal - Login" is_auth={false}>
      <main className={styles.login}>
        <h1>Login to Petal</h1>
        <div className={styles.login__inputArea}>
          {Object.values(providers).map((provider) => {
            return (
              <div key={provider.name}>
                <button
                  type="button"
                  onClick={() =>
                    signIn(provider.id, { callbackUrl: callbackUrl as string })
                  }
                >
                  Sign in with {provider.name}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
