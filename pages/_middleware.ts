import { NextRequest, NextResponse } from 'next/server'
import { getSession } from 'lib/session'

interface SessionData {
  user_id: string
  email: string
  session_id: string
}

export default async function middleware(req: NextRequest) {
  if (!req.cookies.session_id) return NextResponse.redirect('/login')
  const session_data: SessionData = await getSession(req.cookies.session_id)

  console.log(session_data)
  const { pathname } = req.nextUrl
  if (pathname === '/register' || pathname === '/login')
    return NextResponse.redirect('/')
}
