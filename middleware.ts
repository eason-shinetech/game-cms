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

export function middleware(request: NextRequest) {
  // 打印所有请求路径
  console.log('Request URL:', request.url)
  
  // 过滤特定路径的请求
  if (request.nextUrl.pathname.startsWith('/cdn-cgi')) {
    return NextResponse.json(
      { message: 'Endpoint deprecated' },
      { status: 410 }
    )
  }
  
  // 添加 Cloudflare 请求头处理
  const response = NextResponse.next()
  
  // 添加 Cloudflare 要求的安全响应头
  response.headers.set('Content-Security-Policy', "default-src 'self' cloudflare.com *.cloudflare.com;")
  response.headers.set('Permissions-Policy', "interest-cohort=()")
  
  return response
}

export const config = {
  matcher: [
    // 排除 Cloudflare 相关路径
    "/((?!_next|cgi-bin|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|txt)).*)",
  ],
};
