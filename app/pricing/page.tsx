import Link from "next/link";

import KriyavoLogo from "@/components/brand/KriyavoLogo";

export default function PricingPage() {
  const checkoutUrl = process.env.NEXT_PUBLIC_PREMIUM_CHECKOUT_URL;

  return (
    <main className="min-h-screen bg-[#fafbff] px-4 py-8 text-slate-900 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Kriyavo home">
            <KriyavoLogo variant="full" className="h-9 w-auto max-w-[160px]" />
          </Link>
          <Link href="/" className="rounded-full border bg-white px-4 py-2 text-sm font-semibold shadow-sm">
            Back home
          </Link>
        </div>

        <section className="py-14 text-center">
          <div className="mx-auto inline-flex rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-bold text-violet-700 shadow-sm">
            Kriyavo Premium
          </div>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
            Create more with Kriyavo
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Keep the free editor, or upgrade when you need premium content, more cloud storage and advanced creative tools.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="text-sm font-bold text-slate-500">Free</div>
            <div className="mt-2 text-4xl font-black">₹0</div>
            <div className="mt-1 text-sm text-slate-500">For everyday creating</div>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>✓ Social post and resume editor</li>
              <li>✓ Core templates and festival designs</li>
              <li>✓ Local + account autosave</li>
              <li>✓ Standard downloads</li>
            </ul>
            <Link href="/editor?new=1" className="mt-7 inline-flex w-full justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold hover:bg-slate-50">
              Continue free
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-7 shadow-xl shadow-violet-100/60">
            <div className="absolute right-5 top-5 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-amber-700">
              Premium
            </div>
            <div className="text-sm font-bold text-violet-700">Kriyavo Premium</div>
            <div className="mt-2 text-4xl font-black">Upgrade</div>
            <div className="mt-1 text-sm text-slate-500">For creators who need more</div>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>✓ Premium template collections</li>
              <li>✓ More cloud design storage</li>
              <li>✓ Advanced brand and creative tools</li>
              <li>✓ Future premium features under one plan</li>
            </ul>

            {checkoutUrl ? (
              <a href={checkoutUrl} className="mt-7 inline-flex w-full justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-black text-white shadow-lg">
                Upgrade now
              </a>
            ) : (
              <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Premium checkout UI is ready. Connect a Stripe/Razorpay payment link using <code className="font-bold">NEXT_PUBLIC_PREMIUM_CHECKOUT_URL</code> to activate real payments.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
