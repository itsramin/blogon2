import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_CREDENTIALS = {
  user: process.env.ADMIN_USER,
  password: process.env.ADMIN_PASSWORD,
};

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = Buffer.from(authValue, "base64").toString().split(":");

    if (user === ADMIN_CREDENTIALS.user && pwd === ADMIN_CREDENTIALS.password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
