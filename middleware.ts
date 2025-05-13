import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  // set isAuthenticated to true if req.auth is a truthy value. otherwise set to false.
  const isAuthenticated = !!req.auth;

  // use boolean value to determine if the requested route is a protected route
  const isProtectedRoute = ["/admin"].includes(nextUrl.pathname);

  // redirect to signin if route is a protected route and user is not authenticated
  if (isProtectedRoute && !isAuthenticated)
    return Response.redirect(new URL("/login", process.env.NEXTAUTH_URL));

  return NextResponse.next();
});

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  console.log("Skipping middleware for /cdn-cgi path", url.pathname);
  // 加强路径匹配规则
  if (url.pathname === "/cdn-cgi/rum") {
    return new Response(null, {
      status: 204,
      headers: {
        "CF-RAY": req.headers.get("CF-RAY") || "fallback_ray",
        // 修复 IP 获取方式：从 X-Forwarded-For 头获取
        "CF-Connecting-IP": req.headers.get("X-Forwarded-For") || "",
        "Access-Control-Allow-Headers": "Content-Type, CF-RAY",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 允许所有路由通过中间件，但排除静态资源
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
