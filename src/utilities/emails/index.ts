/**
 * Public API for all transactional email templates.
 *
 * Each template exports:
 *   `subject(order)` → string   — the email subject line
 *   `render(order)`  → string   — the full HTML body
 */

export * as adminNewOrder from './adminNewOrder'
export * as contactForm from './contactForm'
export * as orderCanceled from './orderCanceled'
export * as orderConfirmed from './orderConfirmed'
export * as orderDelivered from './orderDelivered'
export * as orderShipping from './orderShipping'

