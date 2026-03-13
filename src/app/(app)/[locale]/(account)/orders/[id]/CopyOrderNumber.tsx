'use client'

import { cn } from '@/utilities/cn'
import { HugeiconsIcon } from '@hugeicons/react'
import { Tick01Icon, Copy01Icon } from '@hugeicons/core-free-icons'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
    orderId: string
    className?: string
}

export const CopyOrderNumber: React.FC<Props> = ({ orderId, className }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(orderId)
        setCopied(true)
        toast.success('Бројот на нарачката е копиран!')
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className={cn(
                'group flex items-center justify-center gap-2 text-sm font-semibold tracking-wide uppercase transition-all whitespace-nowrap',
                'px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900',
                'hover:bg-primary/5 hover:border-primary/20 hover:text-primary dark:hover:bg-primary/10',
                className
            )}
        >
            <span>Нарачка #{orderId}</span>
            {copied ? (
                <HugeiconsIcon icon={Tick01Icon} size={16} className="text-green-500 scale-in" strokeWidth={1.5} />
            ) : (
                <HugeiconsIcon icon={Copy01Icon} size={16} className="text-stone-400 group-hover:text-primary transition-colors" strokeWidth={1.5} />
            )}
        </button>
    )
}
