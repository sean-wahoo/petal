import type { NextPage, GetServerSideProps } from 'next'
import { getSession } from 'lib/session'
import type { SessionProps, SessionError, SessionSuccess } from 'lib/types'
import styles from 'styles/layouts/index.module.scss'
import { logout } from 'lib/utils'
import Router from 'next/router'

const Index: NextPage<SessionProps> = ({ session }) => {
  console.log(session)
  return (
    <div>
      {session.user_id}
      <button
        onClick={async () => {
          await logout(session.session_id, session.user_id)
          Router.reload()
        }}
      >
        logout
      </button>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { session_id } = context.req.cookies
  const session: SessionSuccess | SessionError = await getSession(session_id)
  // console.log(`gssp -> ${JSON.stringify(session)}`)

  return {
    props: { session },
  }
}

export default Index
