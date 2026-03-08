'use client'

import { Slider } from '@/components/ui/slider'
import { createUrl } from '@/utilities/createUrl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useState } from 'react'

type Props = {
    maxPrice?: number
}

export const PriceRangeFilter: React.FC<Props> = ({ maxPrice = 5000 }) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const initialMin = Number(searchParams.get('minPrice')) || 0
    const initialMax = Number(searchParams.get('maxPrice')) || maxPrice

    const [range, setRange] = useState<[number, number]>([initialMin, initialMax])

    const handleValueChange = useCallback((values: number[]) => {
        setRange([values[0], values[1]])
    }, [])

    const handleValueCommit = useCallback(
        (values: number[]) => {
            const params = new URLSearchParams(searchParams.toString())

            if (values[0] > 0) {
                params.set('minPrice', String(values[0]))
            } else {
                params.delete('minPrice')
            }

            if (values[1] < maxPrice) {
                params.set('maxPrice', String(values[1]))
            } else {
                params.delete('maxPrice')
            }

            router.push(createUrl(pathname, params))
        },
        [maxPrice, pathname, router, searchParams],
    )

    return (
        <div className="space-y-4">
            <Slider
                min={0}
                max={maxPrice}
                step={50}
                value={range}
                onValueChange={handleValueChange}
                onValueCommit={handleValueCommit}
                className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="font-medium tabular-nums">${range[0].toLocaleString()}</span>
                <span className="font-medium tabular-nums">${range[1].toLocaleString()}</span>
            </div>
        </div>
    )
}
