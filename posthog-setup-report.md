<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog client-side analytics (`posthog-js`) and server-side analytics (`posthog-node`) were installed and configured. The client is initialized via `instrumentation-client.ts` (Next.js 15.3+ recommended approach), with a reverse proxy configured in `next.config.js` to route analytics through `/ingest/*` for improved ad-blocker resilience. Nine custom events were instrumented across the user journey — from account creation and login to product views, cart interactions, and order placement. Existing Google Analytics tracking was preserved alongside the new PostHog events.

| Event | Description | File |
|---|---|---|
| `account_created` | Fired after a user successfully registers; identifies the user in PostHog | `src/components/forms/CreateAccountForm/index.tsx` |
| `user_logged_in` | Fired after a successful login; identifies the user in PostHog | `src/components/forms/LoginForm/index.tsx` |
| `user_logged_out` | Fired before logout; resets the PostHog session | `src/app/(app)/logout/LogoutPage/index.tsx` |
| `product_viewed` | Fired when a product page is rendered | `src/components/Analytics/TrackProductView.tsx` |
| `product_added_to_cart` | Fired when a user adds a product (with variant selection) to their cart | `src/components/Cart/AddToCart.tsx` |
| `product_quick_added_to_cart` | Fired when a user adds a product directly from the product grid | `src/components/ProductGridItem/QuickAddToCartButton.tsx` |
| `product_wishlisted` | Fired when a user adds a product to their wishlist | `src/components/product/WishlistButton.tsx` |
| `product_unwishlisted` | Fired when a user removes a product from their wishlist | `src/components/product/WishlistButton.tsx` |
| `checkout_started` | Fired when a user clicks "Proceed to checkout" in the cart modal | `src/components/Cart/CartModal.tsx` |
| `order_placed` | Fired after a successful order confirmation | `src/components/checkout/CheckoutPage.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://eu.posthog.com/project/137474/dashboard/557391
  - **Purchase Conversion Funnel** (product_viewed → product_added_to_cart → checkout_started → order_placed): https://eu.posthog.com/project/137474/insights/DsIXPAMZ
  - **Checkout Drop-off Funnel** (checkout_started → order_placed): https://eu.posthog.com/project/137474/insights/sEwx3Gqn
  - **Orders & Checkouts Over Time:** https://eu.posthog.com/project/137474/insights/SzJNHSRQ
  - **User Lifecycle: Signups & Logins:** https://eu.posthog.com/project/137474/insights/menor272
  - **Cart & Wishlist Engagement:** https://eu.posthog.com/project/137474/insights/RMESEcQU

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
