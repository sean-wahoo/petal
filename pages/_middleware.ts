import { NextRequest, NextResponse } from "next/server";
import { decodeSessionToken, isSessionValid, syncSession } from "lib/session";
import { SessionData } from "lib/types";

export default async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const ext: string = pathname.split(".")[1];
    if (["svg", "ico"].includes(ext)) return NextResponse.next();

    if (pathname.split("/")[1] === "api") return NextResponse.next();

    if (!req.cookies.session_payload) {
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
    const session_payload = decodeSessionToken(
      req.cookies.session_payload
    ) as SessionData;
    const sessionIsValid = await isSessionValid(session_payload as any);

    const next = NextResponse.next();

    if (!sessionIsValid) {
      const token = await syncSession(session_payload.user_id);
      next.cookie("session_payload", token);
    }
    return next;
  } catch (e: any) {
    console.error("Something went wrong with authentication!");
    const url = req.nextUrl.clone();
    url.pathname = "/login";

    return NextResponse.redirect(url).clearCookie("session_payload");
  }
}
