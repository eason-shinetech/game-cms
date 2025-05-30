import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  console.log("nextUrl", nextUrl.pathname);

  if (nextUrl.pathname === "/cdn-cgi/rum") {
    console.log("Ignore /cdn-cgi/rum");
    return new Response(null, {
      status: 204,
      headers: {
        "CF-RAY": req.headers.get("CF-RAY") || "fallback_ray",
        "CF-Connecting-IP": req.headers.get("X-Forwarded-For") || "",
      },
    });
  }
  // set isAuthenticated to true if req.auth is a truthy value. otherwise set to false.
  const isAuthenticated = !!req.auth;

  // use boolean value to determine if the requested route is a protected route
  const isProtectedRoute = ["/admin"].includes(nextUrl.pathname);

  // redirect to signin if route is a protected route and user is not authenticated
  if (isProtectedRoute && !isAuthenticated)
    return Response.redirect(new URL("/login", process.env.NEXTAUTH_URL));

  return NextResponse.next();
});


export const config = {
  matcher: [
    // 允许所有路由通过中间件，但排除静态资源
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
