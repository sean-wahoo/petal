import { NextRequest, NextResponse } from 'next/server'
import { getSession } from 'lib/session'

interface SessionData {
  user_id: string
  email: string
  session_id: string
}

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
  const session_data: SessionData = await getSession(req.cookies.session_id)
  req.cookies.session_id?.length > 0 ||
    new NextResponse().cookie('session_id', session_data.session_id)

  if (pathname === '/register' || pathname === '/login')
    return NextResponse.redirect('/')
}
