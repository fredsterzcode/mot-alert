import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Lazy initialization of Supabase client
let supabase = null;

const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn('Supabase environment variables not configured');
      return null;
    }
    
    supabase = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabase;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host')

  // Skip middleware for API routes, static files, and main domain
  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/images/') ||
      pathname.startsWith('/public/')) {
    return NextResponse.next()
  }

  // Extract subdomain
  const subdomain = hostname.split('.')[0]

  // Skip for main domain, www, or localhost
  if (subdomain === 'www' || 
      subdomain === 'motalert' || 
      hostname.includes('localhost') ||
      hostname.includes('127.0.0.1') ||
      hostname.includes('vercel.app')) {
    return NextResponse.next()
  }

  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      // If Supabase is not configured, continue to main site
      return NextResponse.next();
    }

    // Query for active partner with this subdomain
    const { data: partner, error } = await supabaseClient
      .from('partners')
      .select('id, name, subdomain, company_name, logo_url, primary_color, secondary_color, is_active')
      .eq('subdomain', subdomain)
      .eq('is_active', true)
      .single()

    if (error || !partner) {
      // No active partner found, redirect to main site
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Partner found, add partner context to headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-partner-id', partner.id.toString())
    requestHeaders.set('x-partner-name', partner.name)
    requestHeaders.set('x-partner-subdomain', partner.subdomain)
    requestHeaders.set('x-partner-company', partner.company_name)
    requestHeaders.set('x-partner-logo', partner.logo_url || '')
    requestHeaders.set('x-partner-primary-color', partner.primary_color)
    requestHeaders.set('x-partner-secondary-color', partner.secondary_color)

    // If accessing partner dashboard, ensure user is authenticated
    if (pathname.startsWith('/partner/')) {
      // Check if user is authenticated
      const authHeader = request.headers.get('authorization')
      if (!authHeader) {
        // Redirect to login with partner context
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('partner', subdomain)
        return NextResponse.redirect(loginUrl)
      }
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

  } catch (error) {
    console.error('Middleware error:', error)
    // On error, continue to main site
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 