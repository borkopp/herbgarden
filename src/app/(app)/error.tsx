'use client'


export default function Error({ reset }: { reset: () => void }) {
  return (

    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
      <h2 className="text-xl font-bold">Ох не!</h2>
      <p className="my-2">
        Се појави проблем со страната. Ова може да биде привремен проблем, ве молиме обидете се
        повторно.
      </p>
      <button
        className="mx-auto mt-4 flex w-full items-center justify-center rounded-full bg-primary p-4 tracking-wide text-white hover:opacity-90"
        onClick={() => reset()}
        type="button"
      >
        Обидете се повторно
      </button>
    </div>
  )
}
