import React, { ReactNode, ReactElement } from "react";
import Head from "next/head";
import Navbar from "src/components/Navbar";
import styles from "src/styles/components/layout.module.scss";
import { SkeletonTheme } from "react-loading-skeleton";

interface LayoutProps {
  children: ReactNode;
  title: string;
  is_auth: boolean;
  showNavbar?: boolean;
}

export default function Layout({
  children,
  title,
  is_auth,
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
        {is_auth && showNavbar && <Navbar />}
        {children}
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
