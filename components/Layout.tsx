import React, { useEffect } from "react";
import { LayoutProps, SessionData } from "lib/types";
import Head from "next/head";
import Navbar from "components/Navbar";
import styles from "styles/components/layout.module.scss";
import { SkeletonTheme } from "react-loading-skeleton";

export default function Layout({
  children,
  title,
  is_auth,
  session,
  showNavbar = true,
}: LayoutProps) {
  return (
    <div className={styles.layout}>
      <SkeletonTheme
        baseColor="var(--input-bg-2)"
        highlightColor="var(--input-bg)"
      >
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Gafata&family=Galada&family=Poppins&display=swap"
            rel="stylesheet"
          />
          <title>{title}</title>
        </Head>
        {is_auth && showNavbar && <Navbar session={session as any} />}
        {children}
      </SkeletonTheme>
    </div>
  );
}
