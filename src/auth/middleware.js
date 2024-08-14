import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { NextRequest } from 'next/server';

const protectedRoutes = [
  '/dashboard'
];
const unprotectedRoutes = ['/', '/accounts/signUp','/accounts/signIn'];
// export const config = {
//   matcher : ["/((?!api|_next/static|_next/image|favicon.ico|accounts/signIn|accounts/signUp).*"]
// }
export default async function middleware(request) {
  const session = await auth();

  const isProtectedRoute = protectedRoutes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );

  if (!session && isProtectedRoute) {
    const absoluteURL = new URL('/', request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
  if (session && unprotectedRoutes.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL('/dashboard', request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}

export { auth as middleware } from "@/auth"