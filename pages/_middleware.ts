import { NextRequest, NextResponse } from 'next/server'
import { getSession } from 'lib/session'

export default async function middleware(req: NextRequest) {
  if (!req.cookies.session_id) NextResponse.redirect('/login')
  getSession(req.cookies.session_id)
}
