import { SignIn, SignUp } from '@clerk/react';
import { shadcn } from '@clerk/themes';
import { PiArrowLeftDuotone } from 'react-icons/pi';
import { Link } from 'wouter';
import { NexetLogo } from '@/components/nexet-house';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

export const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/nexet-logo.png`,
    socialButtonsPlacement: 'top' as const,
    socialButtonsVariant: 'blockButton' as const,
  },
  variables: {
    colorPrimary: '#3b82f6',
    colorForeground: '#fafafa',
    colorMutedForeground: '#71717a',
    colorBackground: '#0a0a0a',
    colorInput: '#111111',
    colorInputForeground: '#fafafa',
    colorNeutral: '#262626',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '0.75rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#111111] border border-white/10 rounded-2xl w-[440px] max-w-full overflow-hidden shadow-2xl',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    // The Nexet mark sits above the card's heading (it was hidden while the
    // AuthFrame lockup carried the brand; the card owns it now). It is shown
    // whole — no ring, frame or rounded clipping, matching every other mark.
    // The art is mostly deep navy, so a soft glow that follows the mark's own
    // silhouette lifts it off the #111111 card without adding an outline.
    logoBox: 'mb-2 flex justify-center',
    logoImage: 'h-12 w-12 object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]',
    // The card's own headings wear the house display face, the same one the
    // front page's headings use; the form fields stay in Inter for legibility.
    headerTitle: 'font-brand text-white font-bold tracking-[-0.04em]',
    headerSubtitle: 'text-zinc-500',
    socialButtonsBlockButtonText: 'text-white font-semibold',
    formFieldLabel: 'text-zinc-400 font-medium',
    footerActionLink: 'text-[#3b82f6] font-semibold',
    footerActionText: 'text-zinc-500',
    dividerText: 'text-zinc-500',
    socialButtonsBlockButton: 'border border-white/10 bg-[#111111] hover:bg-[#161616]',
    formButtonPrimary: 'bg-[#3b82f6] text-white hover:bg-[#2563eb] font-semibold',
    formFieldInput: 'border border-white/10 bg-[#111111] text-white focus:border-[#3b82f6]',
    alert: 'border border-[#3b82f6]/40 bg-[#3b82f6]/10',
    alertText: 'text-[#60a5fa]',
    formFieldSuccessText: 'text-[#34d399]',
    identityPreviewEditButton: 'text-[#3b82f6] font-semibold',
    dividerLine: 'bg-white/10',
    main: 'gap-5',
  },
};

export function AuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="atrium-grid flex min-h-[100dvh] flex-col items-center px-5 py-7 sm:px-8 sm:py-10">
      <div className="flex w-full max-w-[1060px] items-center justify-between">
        <NexetLogo />
        <Link href="/" className="focus-house group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100" data-testid="link-auth-back-home">
          <PiArrowLeftDuotone className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          Back to the house
        </Link>
      </div>
      <div className="grid w-full max-w-[1060px] flex-1 items-center gap-10 py-12 lg:grid-cols-[.78fr_1fr] lg:gap-20">
        <div className="hidden lg:block">
          <h1 className="mt-6 max-w-[8ch] font-brand text-[clamp(2.6rem,5.4vw,4.4rem)] font-bold leading-[.92] tracking-[-0.05em] text-white">Come in, there&apos;s room.</h1>
          <p className="mt-7 max-w-[20rem] text-sm leading-[1.8] text-zinc-400">Nexet is where unfinished ideas find the person who can change their shape.</p>
          <div className="mt-10 h-1 w-20 rounded-full bg-gradient-to-r from-[#3b82f6] to-transparent" />
        </div>
        <div className="flex justify-center">{children}</div>
      </div>
      <p className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-zinc-600">Nexet / a house for creative connection</p>
    </main>
  );
}

export function SignInPage() {
  return (
    <AuthFrame>
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} appearance={clerkAppearance} />
    </AuthFrame>
  );
}

export function SignUpPage() {
  return (
    <AuthFrame>
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} appearance={clerkAppearance} />
    </AuthFrame>
  );
}
