import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextRequest, NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  console.log('Request URL:', req.url);
  
  // 移除对 /cdn-cgi 路径的拦截
  const response = NextResponse.next();

  // req.auth is provided by Auth.js
  console.log("req.auth.user: ", req.auth?.user, process.env.NEXTAUTH_URL);
  // set isAuthenticated to true if req.auth is a truthy value. otherwise set to false.
  const isAuthenticated = !!req.auth;

  // use boolean value to determine if the requested route is a protected route
  const isProtectedRoute = ["/admin"].includes(nextUrl.pathname);

  // redirect to signin if route is a protected route and user is not authenticated
  if (isProtectedRoute && !isAuthenticated)
    return Response.redirect(new URL("/login", process.env.NEXTAUTH_URL));

  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt)).*)",
  ],
};
