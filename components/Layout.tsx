import React from "react";
import { LayoutProps, SessionData } from "lib/types";
import Head from "next/head";
import Navbar from "components/Navbar";
import styles from "styles/components/layout.module.scss";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSession } from "lib/useSession";

export const SessionContext = React.createContext<
  | {
      session: SessionData;
      updateSession:
        | ((newSession: SessionData) => Promise<string>)
        | ((_: any) => void);
    }
  | undefined
>(undefined);

const Layout = ({
  children,
  title,
  is_auth,
  session,
  updateSession,
  showNavbar = true,
}: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <SkeletonTheme
        baseColor="var(--input-bg-2)"
        highlightColor="var(--input-bg)"
      >
        <Head>
          <title>{title}</title>
        </Head>
        <SessionContext.Provider
          value={
            {
              session,
              updateSession,
            } as {
              session: SessionData;
              updateSession:
                | ((newSession: SessionData) => Promise<string>)
                | ((_: any) => void);
            }
          }
        >
          {is_auth && showNavbar && <Navbar />}

          {children}
        </SessionContext.Provider>
      </SkeletonTheme>
    </div>
  );
};
const LayoutFallback = ({ title }: any) => {
  return (
    <div className={styles.layout_loading}>
      <SkeletonTheme
        baseColor="var(--input-bg-2)"
        highlightColor="var(--input-bg)"
      >
        <Head>
          <title>{title}</title>
        </Head>
        <Skeleton className={styles.react_loading_skeleton} />
      </SkeletonTheme>
    </div>
  );
};

export default ({ children, title, is_auth }: LayoutProps) => {
  const { session, updateSession } = useSession();
  if (!session && is_auth) return <LayoutFallback title={title} />;
  return (
    <Layout
      children={children}
      title={title}
      is_auth={is_auth}
      session={session as SessionData}
      updateSession={updateSession}
    />
  );
};
