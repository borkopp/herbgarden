import { OrderStatus as StatusOptions } from '@/payload-types'
import { cn } from '@/utilities/cn'

type Props = {
  status: StatusOptions | 'shipping' | string
  className?: string
}

export const OrderStatus: React.FC<Props> = ({ status, className }) => {
  return (
    <div
      className={cn(
        'text-[9px] font-bold tracking-[0.15em] uppercase py-2 px-5 rounded-full w-fit inline-flex items-center gap-2.5 border border-black/5 leading-none bg-[#f6f6f6]',
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', {
        'bg-[#E6B905]': status === 'processing',
        'bg-[#10B981]': status === 'completed',
        'bg-[#3B82F6]': status === 'shipping',
        'bg-[#EF4444]': status === 'cancelled' || status === 'refunded',
        'hidden': !['processing', 'completed', 'shipping', 'cancelled', 'refunded'].includes(status as string)
      })} />
      <span className="text-black">
        {status === 'processing' && 'Processing'}
        {status === 'shipping' && 'Shipping'}
        {status === 'completed' && 'Completed'}
        {status === 'cancelled' && 'Cancelled'}
        {status === 'refunded' && 'Refunded'}
        {status && !['processing', 'completed', 'shipping', 'cancelled', 'refunded'].includes(status as string) && status}
      </span>
    </div>
  )
}
