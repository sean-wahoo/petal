import type { SessionSuccess, SessionError } from 'lib/types'
import { NextRequest, NextResponse } from 'next/server'
import { getSession, destroySession } from 'lib/session'

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ext: string = pathname.split('.')[1]
  if (['svg', 'ico'].includes(ext)) return NextResponse.next()

  if (pathname.split('/')[1] === 'api') return NextResponse.next()

  if (!req.cookies.session_id) {
    if (['/login', '/register'].includes(pathname)) {
      return NextResponse.next()
    } else return NextResponse.redirect('login')
  }
  const session_data: SessionSuccess | SessionError = await getSession(
    req.cookies.session_id
  )

  if (
    'is_error' in session_data &&
    session_data.error_message === 'Invalid Session ID!'
  ) {
    const session_id = req.cookies.session_id
    const dev = process.env.NODE_ENV !== 'production'

    await fetch(
      `${dev ? 'http://localhost:3000' : null}/api/auth/destroySession`,
      {
        method: 'POST',
        body: JSON.stringify({ session_id }),
      }
    )
    const res = NextResponse.redirect('/login')
    return res.clearCookie('session_id')
  }

  if (req.cookies.session_id?.length === 0 && 'session_id' in session_data) {
    new NextResponse().cookie('session_id', session_data.session_id)
  }

  if (pathname === '/register' || pathname === '/login')
    return NextResponse.redirect('/')
}
