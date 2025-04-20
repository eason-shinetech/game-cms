import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextRequest, NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  // req.auth is provided by Auth.js
  console.log("req.auth.user: ", req.auth?.user, process.env.NEXTAUTH_URL);
  // set isAuthenticated to true if req.auth is a truthy value. otherwise set to false.
  const isAuthenticated = !!req.auth;

  // use boolean value to determine if the requested route is a protected route
  const isProtectedRoute = ["/admin"].includes(nextUrl.pathname);

  // redirect to signin if route is a protected route and user is not authenticated
  if (isProtectedRoute && !isAuthenticated)
    return Response.redirect(new URL("/login", process.env.NEXTAUTH_URL));
});

export const config = {
  matcher: [
    // 排除 Cloudflare 相关路径
    "/((?!_next|cgi-bin|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|txt)).*)",
  ],
};
