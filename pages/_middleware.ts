import { NextRequest, NextResponse } from 'next/server'
import { getSession } from 'lib/session'

interface SessionData {
  user_id: string
  email: string
  session_id: string
}

export default async function middleware(req: NextRequest, res: NextResponse) {
  if (!req.cookies.session_id) return NextResponse.redirect('/login')
  const session_data: SessionData = await getSession(req.cookies.session_id)
  req.cookies.session_id.length > 0 ||
    res.cookie('session_id', session_data.session_id)

  const { pathname } = req.nextUrl
  if (pathname === '/register' || pathname === '/login')
    return NextResponse.redirect('/')
}
