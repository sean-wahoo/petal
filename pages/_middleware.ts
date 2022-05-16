import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ext: string = pathname.split(".")[1];
  if (["svg", "ico"].includes(ext)) return NextResponse.next();

  if (pathname.split("/")[1] === "api") return NextResponse.next();

  if (!req.cookies.session_id) {
    if (!["/login", "/register"].includes(pathname)) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  if (pathname === "/register" || pathname === "/login") {
    const url = req.nextUrl.clone();

    url.pathname = "/welcome";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
