import React from 'react'
import { LayoutProps } from 'lib/types'
import Head from 'next/head'

export default function Layout({ children, title }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </>
  )
}
