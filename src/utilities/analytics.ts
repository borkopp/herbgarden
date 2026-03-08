export const trackGAEvent = (eventName: string, eventParams: Record<string, any>) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    ;(window as any).gtag('event', eventName, eventParams)
  }
}
