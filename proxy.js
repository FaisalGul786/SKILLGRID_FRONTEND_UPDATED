import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function proxy(req) {
  const token = req.cookies.get('access_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  try {
    const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, SECRET)

    // Forward roleName and email headers down to Server Components
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-role', payload.roleName || 'student')
    requestHeaders.set('x-user-email', payload.email || '')

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch {
    // Token expired or signature invalid
    return NextResponse.redirect(new URL('/auth', req.url))
  }
}

export const config = {
  // Matches /dashboard and any nested dashboard sub-routes
  matcher: ['/dashboard', '/dashboard/:path*'],
}
