import { headers } from 'next/headers'

// Server-side partner context retrieval
export function getPartnerContext() {
  try {
    const headersList = headers()
    const partnerId = headersList.get('x-partner-id')
    const partnerName = headersList.get('x-partner-name')
    const partnerSubdomain = headersList.get('x-partner-subdomain')
    const partnerCompany = headersList.get('x-partner-company')
    const partnerLogo = headersList.get('x-partner-logo')
    const partnerPrimaryColor = headersList.get('x-partner-primary-color')
    const partnerSecondaryColor = headersList.get('x-partner-secondary-color')

    if (!partnerId) return null

    return {
      id: parseInt(partnerId),
      name: partnerName,
      subdomain: partnerSubdomain,
      company_name: partnerCompany,
      logo_url: partnerLogo,
      primary_color: partnerPrimaryColor,
      secondary_color: partnerSecondaryColor
    }
  } catch (error) {
    console.error('Error getting partner context:', error)
    return null
  }
}

// Client-side partner context retrieval
export function getPartnerContextClient() {
  if (typeof window === 'undefined') return null
  
  try {
    // Check if we're on a partner subdomain
    const hostname = window.location.hostname
    const subdomain = hostname.split('.')[0]
    
    if (subdomain === 'www' || subdomain === 'motalert' || hostname.includes('localhost')) {
      return null
    }

    // For client-side, we'll need to fetch partner data
    return { subdomain }
  } catch (error) {
    console.error('Error getting client partner context:', error)
    return null
  }
}

// Apply partner branding to components
export function getPartnerBranding(partner) {
  if (!partner) return {}
  
  return {
    primaryColor: partner.primary_color || '#3B82F6',
    secondaryColor: partner.secondary_color || '#1F2937',
    logoUrl: partner.logo_url,
    companyName: partner.company_name,
    subdomain: partner.subdomain
  }
}

// Get partner-specific title
export function getPartnerTitle(partner, defaultTitle = 'MOT Alert') {
  if (!partner) return defaultTitle
  return `${partner.company_name} - MOT Alert`
}

// Get partner logo or default
export function getPartnerLogo(partner, defaultLogo = '/images/Logo.png') {
  if (!partner || !partner.logo_url) return defaultLogo
  return partner.logo_url
}

// Check if current request is from a partner subdomain
export function isPartnerRequest() {
  try {
    const headersList = headers()
    return !!headersList.get('x-partner-id')
  } catch (error) {
    return false
  }
}

// Get partner subdomain from hostname
export function getPartnerSubdomain(hostname) {
  if (!hostname) return null
  
  const subdomain = hostname.split('.')[0]
  
  if (subdomain === 'www' || subdomain === 'motalert' || hostname.includes('localhost')) {
    return null
  }
  
  return subdomain
}

// Format partner URL
export function getPartnerUrl(subdomain, path = '') {
  if (!subdomain) return path
  
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const domain = process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'motalert.com'
  
  return `${protocol}://${subdomain}.${domain}${path}`
} 