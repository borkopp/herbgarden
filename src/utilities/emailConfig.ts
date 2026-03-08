/**
 * Central configuration for email templates and store branding.
 * Update these values to customise the look and content of all outgoing emails.
 */

// ─── Store Branding ───────────────────────────────────────────────────────────
export const EMAIL_STORE_NAME = 'Tiny Me'
export const EMAIL_STORE_TAGLINE = 'by Pepelashka'

/**
 * Publicly accessible logo URL shown at the top of every email.
 * Recommended size: 200 × 60 px (2× for retina), hosted on a CDN / S3.
 * Set to null to fall back to a plain-text store name header.
 */
export const EMAIL_LOGO_URL: string | null = null

/** Where customers can reach you */
export const EMAIL_CONTACT_EMAIL = 'info@tinyme.mk'
export const EMAIL_STORE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://tinyme.mk'

// ─── Shipping ─────────────────────────────────────────────────────────────────
/** Orders with an `amount` below this threshold incur a flat shipping fee. */
export const FREE_SHIPPING_THRESHOLD = 3000 // MKD

/** Flat shipping fee applied when the order total is below the threshold. */
export const SHIPPING_COST = 150 // MKD

// ─── S3 / Media ───────────────────────────────────────────────────────────────
/**
 * Base URL for publicly readable S3 objects.
 * Format: https://{bucket}.{endpoint-host}/{prefix}
 *
 * Example for Hetzner:
 *   S3_ENDPOINT = https://nbg1.your-objectstorage.com
 *   S3_BUCKET   = digilence
 *   prefix      = tinyme
 *  → https://digilence.nbg1.your-objectstorage.com/tinyme
 */
export const getS3MediaBaseUrl = (): string => {
    const endpoint = process.env.S3_ENDPOINT || '' // e.g. https://nbg1.your-objectstorage.com
    const bucket = process.env.S3_BUCKET || ''
    const prefix = 'tinyme'

    if (!endpoint || !bucket) return ''

    // Convert https://nbg1.your-objectstorage.com → nbg1.your-objectstorage.com
    const host = endpoint.replace(/^https?:\/\//, '')
    return `https://${bucket}.${host}/${prefix}`
}

/**
 * Build a full public URL for a media document's filename.
 * Pass the raw `filename` field from a populated Payload media doc.
 */
export const getMediaUrl = (filename: string | null | undefined): string | null => {
    if (!filename) return null
    const base = getS3MediaBaseUrl()
    if (!base) return null
    return `${base}/${filename}`
}

// ─── Design Tokens ────────────────────────────────────────────────────────────
export const EMAIL_PRIMARY_COLOR = '#d39d1f'
export const EMAIL_BG_COLOR = '#ffffff'
export const EMAIL_TEXT_COLOR = '#1A202C'
export const EMAIL_MUTED_COLOR = '#6B7280'
export const EMAIL_BORDER_COLOR = '#E5E7EB'
export const EMAIL_SURFACE_COLOR = '#F9FAFB'
