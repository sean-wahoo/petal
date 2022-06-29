import { NextResponse } from "next/server";
import { decodeSessionToken, isSessionValid, syncSession } from "lib/session";
import type { NextRequest } from "next/server"

export default async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const ext: string = pathname.split(".")[1];
    if (["svg", "ico"].includes(ext)) return NextResponse.next();
    if (pathname.startsWith("/api") || pathname.startsWith('/_next')) return NextResponse.next();
    const session_token_encoded = req.cookies.get('session_token');
    
    // all route behaviors if no cookie is found
    if (!session_token_encoded) {

      // if any route besides login and register 
      if (!["/login", "/register"].includes(pathname)) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      // if login or register
      return NextResponse.next();

    }

    const session_token_decoded = await decodeSessionToken(session_token_encoded as string)

    const isAuth = Object.keys(session_token_decoded).includes('user_id')

    if (["/login", "/register"].includes(pathname)) {
      return isAuth ?
        NextResponse.redirect(new URL('/', req.url)) :
        NextResponse.next();
    }
    
    if (pathname === "/") {
      if (!isAuth) return NextResponse.next();
      return session_token_decoded?.been_welcomed === true ?
        NextResponse.next() :
        NextResponse.redirect(new URL('/login', req.url))
    }

    const sessionIsValid = await isSessionValid(session_token_decoded);
    if (!sessionIsValid) {
      const token = await syncSession(session_token_decoded.user_id);
      req.cookies.delete('session_token')
      req.cookies.set('session_token', token)
      NextResponse.next()
    }

    return NextResponse.next()
  } catch (e: any) {
    console.log({ e })
    console.error("Something went wrong with authentication!");
    req.cookies.delete('session_token')
    return NextResponse.redirect(new URL('/login', req.url))
  }
}
