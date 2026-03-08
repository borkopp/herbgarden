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
        'text-[11px] font-bold tracking-wider uppercase py-1 px-3 rounded-full w-fit inline-flex items-center gap-1.5',
        className,
        {
          'bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': status === 'processing',
          'bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400': status === 'completed',
          'bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': status === 'shipping',
          'bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400': status === 'cancelled' || status === 'refunded',
        },
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', {
        'bg-amber-500 dark:bg-amber-400': status === 'processing',
        'bg-green-500 dark:bg-green-400': status === 'completed',
        'bg-blue-500 dark:bg-blue-400': status === 'shipping',
        'bg-red-500 dark:bg-red-400': status === 'cancelled' || status === 'refunded',
        'hidden': !['processing', 'completed', 'shipping', 'cancelled', 'refunded'].includes(status as string)
      })} />
      {status === 'processing' && 'Во обработка'}
      {status === 'shipping' && 'Во достава'}
      {status === 'completed' && 'Завршена'}
      {status === 'cancelled' && 'Откажана'}
      {status === 'refunded' && 'Рефундирана'}
      {status && !['processing', 'completed', 'shipping', 'cancelled', 'refunded'].includes(status as string) && status}
    </div>
  )
}
