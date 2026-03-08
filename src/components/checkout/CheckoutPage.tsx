'use client'

import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import posthog from 'posthog-js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { AddressItem } from '@/components/addresses/AddressItem'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { CheckoutAddresses } from '@/components/checkout/CheckoutAddresses'
import { FormItem } from '@/components/forms/FormItem'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Checkbox } from '@/components/ui/checkbox'
import { Address, Product } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { useAddresses, useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ChevronRight,
  CreditCard,
  Info,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck
} from 'lucide-react'
import { toast } from 'sonner'

const StepHeader = ({
  number,
  title,
  active,
  completed,
  icon: Icon
}: {
  number: number,
  title: string,
  active?: boolean,
  completed?: boolean,
  icon: any
}) => (
  <div className="flex items-center gap-4 mb-6">
    <div className={cn(
      "flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300 shadow-sm",
      active ? "bg-primary text-primary-foreground scale-110 shadow-primary/20" :
        completed ? "bg-green-500 text-white" : "bg-stone-100 dark:bg-stone-800 text-stone-400"
    )}>
      {completed ? <ShieldCheck className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
    </div>
    <div>
      <p className={cn(
        "text-xs font-bold uppercase tracking-wider mb-0.5 transition-colors",
        active ? "text-primary" : "text-stone-400"
      )}>
        Чекор {number}
      </p>
      <h2 className={cn(
        "font-bold text-xl transition-colors",
        active ? "text-stone-900 dark:text-stone-50" : "text-stone-500"
      )}>
        {title}
      </h2>
    </div>
  </div>
)

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { cart } = useCart()
  const [error, setError] = useState<null | string>(null)

  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const { initiatePayment, confirmOrder } = usePayments()
  const { addresses } = useAddresses()
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>()
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)

  const cartIsEmpty = !cart || !cart.items || !cart.items.length

  const currentStep = useMemo(() => {
    if (!user && !emailSubmitted) return 1
    if (!billingAddress) return 2
    return 3
  }, [user, emailSubmitted, billingAddress])

  const canPlaceOrder = Boolean(
    (email || user) && billingAddress,
  )

  const cartTotalMKD = useMemo(() => {
    if (!cart?.items?.length) return 0
    return cart.items.reduce((total, item) => {
      const product = item.product
      const variant = item.variant

      let price = 0
      if (typeof product === 'object' && product !== null) {
        price = (product as Product).priceInMKD || 0
      }

      const isVariant = Boolean(variant) && typeof variant === 'object'
      if (isVariant && variant) {
        price = (variant as any).priceInMKD || price
      }

      return total + (price * (item.quantity || 1))
    }, 0)
  }, [cart])

  // Prefill default address for logged-in users
  useEffect(() => {
    if (!billingAddress && addresses && addresses.length > 0) {
      const defaultAddress = addresses[0]
      if (defaultAddress) {
        setBillingAddress(defaultAddress)
      }
    }
  }, [addresses])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setShippingAddress(undefined)
      setBillingAddress(undefined)
      setBillingAddressSameAsShipping(true)
      setEmail('')
      setEmailSubmitted(false)
    }
  }, [])

  const handlePlaceOrder = useCallback(async () => {
    setIsPlacingOrder(true)
    setError(null)

    try {
      const paymentData = (await initiatePayment('cash-on-delivery', {
        additionalData: {
          ...(email ? { customerEmail: email } : {}),
          billingAddress,
          shippingAddress: billingAddressSameAsShipping ? billingAddress : shippingAddress,
        },
      })) as Record<string, unknown>

      if (!paymentData) {
        throw new Error('Не е можно да се иницира нарачката.')
      }

      const confirmResult = (await confirmOrder('cash-on-delivery', {
        additionalData: {
          ...(email ? { customerEmail: email } : {}),
          transactionID: paymentData['transactionID'],
          cartItemsSnapshot: paymentData['cartItemsSnapshot'],
          shippingAddressSnapshot: paymentData['shippingAddressSnapshot'],
        },
      })) as Record<string, unknown>

      if (confirmResult && confirmResult['orderID']) {
        posthog.capture('order_placed', {
          order_id: confirmResult['orderID'],
          cart_total: cartTotalMKD,
          cart_item_count: cart?.items?.length,
          payment_method: 'cash-on-delivery',
          currency: 'MKD',
          is_guest: !user,
        })
        router.push(`/order-status/${confirmResult['orderID']}`)
      } else {
        throw new Error('Нарачката не може да се потврди.')
      }
    } catch (err) {
      posthog.captureException(err instanceof Error ? err : new Error(String(err)))
      const errorData = err instanceof Error ? (() => {
        try { return JSON.parse(err.message) } catch { return {} }
      })() : {}

      let errorMessage = 'Настана грешка при поставување на нарачката.'
      if (errorData?.cause?.code === 'OutOfStock') {
        errorMessage = 'Еден или повеќе производи во вашата кошничка не се на залиха.'
      }

      setError(errorMessage)
      toast.error(errorMessage)
      setIsPlacingOrder(false)
    }
  }, [billingAddress, billingAddressSameAsShipping, shippingAddress, email, initiatePayment, confirmOrder, router])

  if (isPlacingOrder) {
    return (
      <div className="py-32 w-full flex flex-col items-center justify-center gap-8 text-center animate-in fade-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
          <LoadingSpinner className="relative z-10 w-16 h-16 text-primary" />
        </div>
        <div className="space-y-2 relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">Нарачката се поставува...</h1>
          <p className="text-muted-foreground text-lg">Ве молиме почекајте додека ја процесираме вашата нарачка.</p>
        </div>
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="max-w-md mx-auto py-32 flex flex-col items-center text-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-24 h-24 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-stone-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Вашата кошничка е празна</h2>
          <p className="text-stone-500">Изгледа дека сè уште немате додадено производи во вашата кошничка.</p>
        </div>
        <Button asChild size="lg" className="rounded-full px-8 py-6 font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
          <Link href="/shop">Продолжи со купување</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* ─── LEFT: MAIN CONTENT ─── */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-12">
          {/* ─── HEADER ─── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="space-y-2">
              <Link href="/cart" className="inline-flex items-center text-stone-400 hover:text-primary transition-colors text-sm font-medium mb-2">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Назад во кошничка
              </Link>
              <h1 className="text-4xl font-extrabold tracking-tight">Верификација</h1>
              <p className="text-stone-500 text-lg">Завршете ја вашата нарачка во неколку лесни чекори.</p>
            </div>

            {/* ── Mobile Stepper Indicator ── */}
            <div className="flex md:hidden items-center p-1 bg-stone-100 dark:bg-stone-900 rounded-full w-fit">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "h-2 rounded-full transition-all duration-500 mx-1",
                    s < currentStep ? "w-4 bg-green-500" :
                      s === currentStep ? "w-8 bg-primary" : "w-4 bg-stone-300 dark:bg-stone-800"
                  )}
                />
              ))}
            </div>
          </div>

          {/* ── STEP 1: CONTACT ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-1"
          >
            <StepHeader
              number={1}
              title="Информации за контакт"
              active={currentStep === 1}
              completed={currentStep > 1}
              icon={Mail}
            />

            <div className={cn(
              "rounded-3xl border transition-all duration-500 bg-white dark:bg-black/20 overflow-hidden",
              currentStep === 1 ? "border-primary/20 shadow-2xl shadow-primary/5 ring-1 ring-primary/5" : "border-stone-100 dark:border-stone-800 opacity-75"
            )}>
              {currentStep === 1 ? (
                <div className="p-8 space-y-8">
                  {!user && (
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <h4 className="font-bold text-stone-800 dark:text-stone-200">Веќе имате профил?</h4>
                        <p className="text-sm text-stone-500">Најавете се за побрзо нарачување и историја на нарачки.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button asChild size="sm" variant="outline" className="rounded-xl font-bold px-5">
                          <Link href="/login">Најава</Link>
                        </Button>
                        <Button asChild size="sm" className="rounded-xl font-bold px-5">
                          <Link href="/create-account">Регистрирај се</Link>
                        </Button>
                      </div>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {user ? (
                      <motion.div
                        key="user-info"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between p-6 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-bold">{user.email?.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mb-0.5">Најавени сте како</p>
                            <p className="font-bold text-stone-900 dark:text-stone-100">{user.email}</p>
                          </div>
                        </div>
                        <Link href="/logout" className="text-stone-400 hover:text-red-500 text-sm font-bold transition-colors">Одјава</Link>
                      </motion.div>
                    ) : emailSubmitted ? (
                      <motion.div
                        key="guest-info"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-between p-6 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800"
                      >
                        <div>
                          <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mb-0.5">Нарачувате како гост</p>
                          <p className="font-bold text-stone-900 dark:text-stone-100 text-lg">{email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEmailSubmitted(false)}
                          className="font-bold text-primary hover:bg-primary/5 rounded-xl transition-all"
                        >
                          Промени
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="email-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <FormItem>
                          <Label htmlFor="email" className="font-bold text-stone-600 dark:text-stone-400 mb-3 block">Вашата е-пошта</Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                            <Input
                              id="email"
                              name="email"
                              className="pl-12 py-7 text-lg rounded-2xl border-stone-200 placeholder:text-stone-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="ime@email.com"
                              required
                              type="email"
                              value={email}
                            />
                          </div>
                          <p className="text-xs text-stone-400 mt-2 ml-1 flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5" />
                            Таму ќе го добиете бројот на нарачката и потврдата.
                          </p>
                        </FormItem>
                        <Button
                          disabled={!email || !/^\S+@\S+\.\S+$/.test(email)}
                          className="w-full sm:w-auto h-14 rounded-2xl px-12 font-bold text-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                          onClick={(e) => { e.preventDefault(); setEmailSubmitted(true) }}
                        >
                          Продолжи
                          <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="p-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-900 dark:text-stone-100">{user ? user.email : email}</p>
                      <p className="text-xs text-stone-400">Контакт информациите се зачувани</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-stone-400 font-bold hover:text-primary transition-colors"
                    onClick={() => {
                      setEmailSubmitted(false)
                      // No explicit step state needed as it's computed
                    }}
                  >
                    Измени
                  </Button>
                </div>
              )}
            </div>
          </motion.section>

          {/* ── STEP 2: ADDRESS ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-1"
          >
            <StepHeader
              number={2}
              title="Адреса за достава"
              active={currentStep === 2}
              completed={currentStep > 2}
              icon={MapPin}
            />

            <div className={cn(
              "rounded-3xl border transition-all duration-500 bg-white dark:bg-black/20 overflow-hidden",
              currentStep === 2 ? "border-primary/20 shadow-2xl shadow-primary/5 ring-1 ring-primary/5" : "border-stone-100 dark:border-stone-800 opacity-75"
            )}>
              {currentStep >= 2 ? (
                <div className="p-8">
                  {billingAddress ? (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-8"
                    >
                      <div className="relative group">
                        <div className="absolute inset-x-0 -inset-y-2 bg-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <AddressItem
                          actions={
                            <Button
                              variant="ghost"
                              className="rounded-xl text-primary font-bold hover:bg-primary/5 transition-all h-auto py-3 px-5 shadow-none"
                              onClick={(e) => { e.preventDefault(); setBillingAddress(undefined) }}
                            >
                              Промени
                            </Button>
                          }
                          address={billingAddress}
                        />
                      </div>

                      <div className="divider h-px bg-stone-100 dark:bg-stone-800 w-full" />

                      <div className="flex flex-col gap-6">
                        <div className="flex gap-3 items-center">
                          <Checkbox
                            id="shippingTheSameAsBilling"
                            checked={billingAddressSameAsShipping}
                            onCheckedChange={(state) => setBillingAddressSameAsShipping(state as boolean)}
                            className="w-6 h-6 rounded-lg data-[state=checked]:bg-primary transition-all border-stone-200 dark:border-stone-800"
                          />
                          <Label htmlFor="shippingTheSameAsBilling" className="font-bold text-stone-700 dark:text-stone-300 cursor-pointer select-none">
                            Адресата за наплата е иста како за достава
                          </Label>
                        </div>

                        {!billingAddressSameAsShipping && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-4"
                          >
                            <h4 className="font-bold text-stone-900 dark:text-stone-100">Адреса за наплата</h4>
                            {shippingAddress ? (
                              <AddressItem
                                actions={
                                  <Button
                                    variant="ghost"
                                    className="text-primary font-bold hover:bg-primary/5 rounded-xl h-auto py-3"
                                    onClick={(e) => { e.preventDefault(); setShippingAddress(undefined) }}
                                  >
                                    Промени
                                  </Button>
                                }
                                address={shippingAddress}
                              />
                            ) : user ? (
                              <CheckoutAddresses setAddressAction={setShippingAddress} />
                            ) : (
                              <CreateAddressModal
                                callbackAction={(address: Partial<Address>) => setShippingAddress(address)}
                                skipSubmission={true}
                              />
                            )}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="address-picker"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {user ? (
                        <CheckoutAddresses setAddressAction={setBillingAddress} />
                      ) : (
                        <div className="flex flex-col items-center gap-6 py-8">
                          <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-primary" />
                          </div>
                          <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold">Каде да ја испратиме вашата нарачка?</h3>
                            <p className="text-stone-500 max-w-sm">Внесете ја вашата адреса за да можеме да ја доставиме вашата нарачка што е можно побрзо.</p>
                          </div>
                          <CreateAddressModal
                            disabled={!emailSubmitted && !user}
                            callbackAction={(address: Partial<Address>) => setBillingAddress(address)}
                            skipSubmission={true}
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-stone-400 italic font-medium">
                  Завршете го првиот чекор за да продолжите.
                </div>
              )}
            </div>
          </motion.section>

          {/* ── STEP 3: PAYMENT ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-1"
          >
            <StepHeader
              number={3}
              title="Начин на плаќање"
              active={currentStep === 3}
              completed={currentStep > 3}
              icon={CreditCard}
            />

            <div className={cn(
              "rounded-3xl border transition-all duration-500 bg-white dark:bg-black/20 overflow-hidden",
              currentStep === 3 ? "border-primary/20 shadow-2xl shadow-primary/5 ring-1 ring-primary/5" : "border-stone-100 dark:border-stone-800 opacity-75"
            )}>
              {currentStep >= 3 ? (
                <div className="p-8">
                  <div className="bg-primary/5 border-2 border-primary/20 rounded-3xl p-6 flex flex-col md:flex-row items-center md:items-start gap-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white shrink-0 shadow-lg shadow-primary/20 relative z-10">
                      <Truck className="w-7 h-7" />
                    </div>

                    <div className="relative z-10 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
                        <p className="font-extrabold text-lg text-stone-900 dark:text-stone-100 uppercase tracking-tight">Плаќање при достава</p>
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-stone-500 text-[13px] font-medium leading-relaxed mb-4 max-w-xl">
                        Платете во готово на курирот кога ќе го примите пакетот на вашата адреса. Ова е најбезбедниот начин на купување.
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          'Без онлајн трансакции',
                          'Плаќање само на примање',
                          'Директна достава до врата',
                          'Проверка на пратката'
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2.5 text-xs font-bold text-stone-700 dark:text-stone-300">
                            <div className="w-4 h-4 rounded-full bg-green-500/10 flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-green-500" />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-stone-400 italic font-medium">
                  Завршете ги претходните чекори за да го изберете начинот на плаќање.
                </div>
              )}
            </div>
          </motion.section>

          {/* ── ERROR DISPLAY ── */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-3xl p-6 flex gap-4 items-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                <Info className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-600 dark:text-red-400 font-bold text-lg">{error}</p>
            </motion.div>
          )}

          {/* ── CTA BUTTON (Desktop) ── */}
          <div className="hidden xl:block pt-4">
            <Button
              className="w-full h-14 font-serif font-black rounded-3xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-primary/30 disabled:opacity-50 disabled:hover:scale-100 group"
              disabled={!canPlaceOrder}
              onClick={(e) => { e.preventDefault(); void handlePlaceOrder() }}
            >
              <Package className="mr-2 group-hover:rotate-12 transition-transform" />
              ПОТВРДИ НАРАЧКА
            </Button>
            <p className="text-center text-stone-400 text-sm mt-4 font-medium italic">
              Ве молиме проверете ги сите податоци пред да ја потврдите нарачката.
            </p>
          </div>
        </div>

        {/* ─── RIGHT: SIDEBAR SUMMARY ─── */}
        <div className="lg:col-span-12 xl:col-span-5 lg:sticky lg:top-16 space-y-8">
          <div className="bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl shadow-stone-200/40 dark:shadow-none">
            {/* ── SUMMARY HEADER ── */}
            <div className="p-10 pb-6">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-medium tracking-tight font-serif text-stone-900 dark:text-stone-100">Кошничка</h3>
                <span className="bg-primary/10 text-primary px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                  {cart?.items?.length} {cart?.items?.length === 1 ? 'Производ' : 'Производи'}
                </span>
              </div>

              {/* ── SHIPPING PROGRESS ── */}
              {/* <div className="mb-10 p-4 bg-white dark:bg-black/30 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 text-stone-500">
                    <Truck className="w-3.5 h-3.5 text-primary" />
                    Достава
                  </span>
                  {cartTotalMKD >= 3000 ? (
                    <span className="text-green-500 font-extrabold text-[9px] uppercase tracking-widest bg-green-500/5 px-2 py-0.5 rounded-full border border-green-500/10">Бесплатна! 🎉</span>
                  ) : (
                    <span className="text-stone-400 font-extrabold text-[9px] uppercase tracking-widest bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">Стандард</span>
                  )}
                </div>
                <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden mb-3 relative z-10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((cartTotalMKD / 3000) * 100, 100)}%` }}
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      cartTotalMKD >= 3000 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                    )}
                  />
                </div>
                {cartTotalMKD < 3000 ? (
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest text-center leading-tight relative z-10">
                    Уште <Price as="span" className="text-primary font-black mx-0.5" amount={3000 - cartTotalMKD} /> до бесплатна достава
                  </p>
                ) : (
                  <p className="text-[9px] text-green-500 font-black uppercase tracking-widest text-center leading-tight relative z-10 drop-shadow-sm">
                    Бесплатна достава низ цела Македонија!
                  </p>
                )}
              </div> */}

              {/* ── ITEM LIST ── */}
              <div className="space-y-8 max-h-[450px] overflow-y-visible pr-4 custom-scrollbar">
                {cart?.items?.map((item, index) => {
                  if (typeof item.product === 'object' && item.product) {
                    const {
                      product,
                      product: { meta, title, gallery },
                      quantity,
                      variant,
                    } = item

                    if (!quantity) return null

                    let image = gallery?.[0]?.image || meta?.image
                    let price = (product as Product)?.priceInMKD

                    const isVariant = Boolean(variant) && typeof variant === 'object'

                    if (isVariant) {
                      price = (variant as any)?.priceInMKD

                      const imageVariant = (product as Product).gallery?.find((item: any) => {
                        if (!item.variantOption) return false
                        const variantOptionID =
                          typeof item.variantOption === 'object'
                            ? item.variantOption.id
                            : item.variantOption

                        const hasMatch = (variant as any)?.options?.some((option: any) => {
                          if (typeof option === 'object') return option.id === variantOptionID
                          else return option === variantOptionID
                        })

                        return hasMatch
                      })

                      if (imageVariant && typeof imageVariant.image !== 'string') {
                        image = imageVariant.image
                      }
                    }

                    return (
                      <motion.div
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        className="flex gap-6 group"
                        key={index}
                      >
                        <div className="relative w-24 h-24 rounded-[1.75rem] bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 p-2 shrink-0 transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-stone-200/40 dark:group-hover:shadow-none">
                          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner">
                            {image && typeof image !== 'string' && (
                              <Media fill imgClassName="object-cover transition-transform duration-700 group-hover:scale-110" resource={image} />
                            )}
                          </div>
                          <div className="absolute -top-3 -right-3 w-8 h-8 bg-stone-900 border-2 border-white dark:border-stone-800 rounded-full flex items-center justify-center shadow-lg group-hover:bg-primary transition-colors">
                            <span className="text-[11px] text-white font-black">{quantity}</span>
                          </div>
                        </div>
                        <div className="flex-1 py-1 flex flex-col justify-center gap-2">
                          <h4 className="text-[13px] font-extrabold text-stone-900 dark:text-stone-100 line-clamp-2 leading-tight transition-colors group-hover:text-primary">
                            {title}
                          </h4>
                          {variant && typeof variant === 'object' && (
                            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-primary/70 bg-primary/5 w-fit px-2 py-0.5 rounded-md">
                              {(variant as any).options
                                ?.map((option: any) => {
                                  if (typeof option === 'object') return option.label
                                  return null
                                })
                                .join(' • ')}
                            </p>
                          )}
                          <div className="flex justify-between items-center mt-1">
                            <Price as="span" className="text-[13px] font-black tracking-tight" amount={price || 0} />
                          </div>
                        </div>
                      </motion.div>
                    )
                  }
                  return null
                })}
              </div>
            </div>

            {/* ── SUMMARY DASHBOARD ── */}
            <div className="mt-6 p-10 bg-white dark:bg-black/50 border-t border-stone-100 dark:border-stone-800 space-y-6">
              <div className="flex justify-between items-center text-stone-400 font-bold text-xs uppercase tracking-widest">
                <span>Производи</span>
                <Price amount={cartTotalMKD} className="font-exrabold text-sm text-stone-900 dark:text-stone-100" />
              </div>
              <div className="flex justify-between items-center text-stone-400 font-bold text-xs uppercase tracking-widest">
                <span>Достава до адреса</span>
                {cartTotalMKD >= 3000 ? (
                  <span className="text-green-500 font-black tracking-[0.1em] bg-green-500/5 px-3 py-1 rounded-full text-[10px]">БЕСПЛАТНА</span>
                ) : (
                  <span className="font-extrabold text-stone-900 dark:text-stone-100">150 ден</span>
                )}
              </div>

              <div className="pt-8 mt-4 border-t-2 border-stone-50 dark:border-stone-800/50">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Вкупно за плаќање</p>
                    <p className="text-stone-400 text-[10px] font-medium leading-none flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-green-500" />
                      Вклучен ДДВ и достава
                    </p>
                  </div>
                  <Price as="span" className="text-4xl font-bold font-serif tracking-tighter" amount={cartTotalMKD + (cartTotalMKD >= 3000 ? 0 : 150)} />
                </div>
              </div>
            </div>
          </div>

          {/* ── SECURITY BADGE ── */}
          {/* <div className="p-8 rounded-[2rem] border-2 border-dashed border-stone-200 dark:border-stone-800 flex items-center gap-6 bg-stone-50/30 dark:bg-transparent transition-colors hover:bg-stone-50 dark:hover:bg-stone-900/10">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-black text-stone-800 dark:text-stone-200 uppercase tracking-tight">Безбедна Нарачка</p>
              <p className="text-sm text-stone-400 font-medium leading-relaxed">Вашите податоци се заштитени со најновата 256-битна SSL енкрипција.</p>
            </div>
          </div> */}

          {/* ── MOBILE PLACE ORDER ── */}
          <div className="xl:hidden pb-12">
            <Button
              className="w-full h-16 text-lg font-serif font-semibold rounded-3xl shadow-2xl shadow-primary/20 transition-all active:scale-95 group"
              disabled={!canPlaceOrder}
              onClick={(e) => { e.preventDefault(); void handlePlaceOrder() }}
            >
              <Package className="mr-2 h-16 w-16" />
              ПОТВРДИ НАРАЧКА
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  )
}
