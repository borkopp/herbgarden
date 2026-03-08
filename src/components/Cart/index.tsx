
import { Cart as CartType } from '@/payload-types'
import { CartModal } from './CartModal'

export type CartItem = NonNullable<CartType['items']>[number]

export function Cart({ className }: { className?: string }) {
  return <CartModal className={className} />
}
