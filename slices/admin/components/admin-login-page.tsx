import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import type { AdminLoginPageProps } from "../types";

const messages: Record<string, string> = {
  invalid: "Email atau password tidak cocok.",
  locked: "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba kembali.",
  service: "Layanan autentikasi sedang tidak tersedia. Coba kembali sebentar lagi.",
};

export function AdminLoginPage({ error }: AdminLoginPageProps) {
  return (
    <main id="main-content" className="grid min-h-screen lg:grid-cols-[.92fr_1.08fr]">
      <section className="surface-grain hidden min-h-screen flex-col justify-between bg-charcoal p-14 text-ivory lg:flex">
        <p className="kicker text-warm-sand">Hospitality Operations · Private administration</p>
        <div className="max-w-xl">
          <p className="font-serif text-8xl leading-[.82] tracking-[-.05em]">A quieter way to welcome.</p>
          <p className="mt-10 max-w-md text-base leading-8 text-ivory/75">
            Kelola operasi, konten, dan pengalaman tamu tanpa mengekspos data privat.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs tracking-[.15em] text-ivory/65 uppercase">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Secure server-side session
        </div>
      </section>

      <section className="content-inset flex min-h-screen items-center justify-center py-16 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <div className="flex size-12 items-center justify-center border border-charcoal/20 bg-warm-sand/35">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </div>
          <p className="kicker mt-10 text-umber">Operations admin</p>
          <h1 className="mt-5 font-serif text-6xl leading-[.9] tracking-[-.04em] sm:text-7xl">Sign in.</h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-ink-soft">
            Gunakan kredensial admin yang tersimpan di environment production.
          </p>

          {error ? (
            <p role="alert" className="mt-7 border-l-2 border-[#843f35] bg-[#f4e0db] px-4 py-3 text-sm leading-6 text-[#6f2d25]">
              {messages[error] ?? messages.invalid}
            </p>
          ) : null}

          <form action="/api/admin/session" method="post" className="mt-9 space-y-6">
            <input type="hidden" name="intent" value="login" />
            <label className="block">
              <span className="kicker text-charcoal/65">Admin email</span>
              <input
                name="email"
                type="email"
                autoComplete="username"
                inputMode="email"
                required
                className="mt-3 min-h-14 w-full border border-charcoal/20 bg-paper px-4 text-base outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20"
              />
            </label>
            <label className="block">
              <span className="kicker text-charcoal/65">Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={16}
                className="mt-3 min-h-14 w-full border border-charcoal/20 bg-paper px-4 text-base outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20"
              />
            </label>
            <button type="submit" className="cta-solid w-full">
              Enter dashboard
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </form>
          <p className="mt-8 text-xs leading-6 text-ink-soft">
            Login dibatasi, session menggunakan cookie HttpOnly, dan halaman admin tidak dapat diindeks mesin pencari.
          </p>
        </div>
      </section>
    </main>
  );
}
