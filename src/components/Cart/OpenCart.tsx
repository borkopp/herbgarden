import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
}) {
  return (
    <Button
      variant="nav"
      size="clear"
      className="relative flex items-center justify-center hover:cursor-pointer"
      {...rest}
    >
      <ShoppingCart className="size-5 text-foreground" />

      {quantity ? (
        <span className="absolute -top-2 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white ring-2 ring-background">
          {quantity}
        </span>
      ) : null}
    </Button>
  )
}
