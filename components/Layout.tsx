import React from 'react'
import { LayoutProps, SessionData } from 'lib/types'
import Head from 'next/head'
import Navbar from 'components/Navbar'
import styles from 'styles/components/layout.module.scss'

export default function Layout({
  children,
  title,
  is_auth,
  session_data,
}: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Head>
        <title>{title}</title>
      </Head>
      {is_auth && <Navbar profile={{ ...session_data } as SessionData} />}
      {children}
    </div>
  )
}
