import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ext: string = pathname.split('.')[1]
  if (['svg', 'ico'].includes(ext)) return NextResponse.next()

  if (pathname.split('/')[1] === 'api') return NextResponse.next()

  if (!req.cookies.session_id) {
    if (['/login', '/register'].includes(pathname)) {
      return NextResponse.next()
    } else return NextResponse.redirect('/login')
  }

  if (pathname === '/register' || pathname === '/login')
    return NextResponse.redirect('/')
  return NextResponse.next()
}
