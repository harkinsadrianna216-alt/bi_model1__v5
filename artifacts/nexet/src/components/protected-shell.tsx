import { useAuth, useClerk, useUser } from '@clerk/react';
import {
  getGetCollaborationInboxQueryKey,
  getListVideoNotificationsQueryKey,
  useGetCollaborationInbox,
  useListVideoNotifications,
} from '@workspace/api-client-react';
import {
  PiArrowUpRightDuotone,
  PiChartLineUpDuotone,
  PiListDuotone,
  PiSignOutDuotone,
  PiSquaresFourDuotone,
  PiTicketDuotone,
  PiTrayDuotone,
  PiUserCircleDuotone,
  PiXDuotone,
} from 'react-icons/pi';
import type { IconType } from 'react-icons';
import { type ReactNode, useState } from 'react';
import { Link, Redirect, useLocation } from 'wouter';
import { NexetLogo } from '@/components/nexet-house';

const desktopNav = [
  { href: '/dashboard', label: 'Atrium', icon: PiSquaresFourDuotone },
  { href: '/activity', label: 'Activity', icon: PiChartLineUpDuotone },
  { href: '/inbox', label: 'Inbox', icon: PiTrayDuotone },
  { href: '/subscriptions', label: 'Subscriptions', icon: PiTicketDuotone },
];

const mobileNav = [
  { href: '/dashboard', label: 'Atrium', icon: PiSquaresFourDuotone },
  { href: '/activity', label: 'Activity', icon: PiChartLineUpDuotone },
  { href: '/inbox', label: 'Inbox', icon: PiTrayDuotone },
  { href: '/subscriptions', label: 'Subscriptions', icon: PiTicketDuotone },
  { href: '/profile', label: 'Profile', icon: PiUserCircleDuotone },
];

/**
 * The header every page behind the sign-in wall opens with: the display line
 * and, when a page has one, a control on the right. Nothing above the title and
 * no paragraph explaining the page underneath it — the page says what it is.
 */
export function PageHeader({
  title,
  accent,
  aside,
}: {
  title: string;
  accent?: string;
  aside?: ReactNode;
}) {
  return (
    <header className="reveal flex flex-col justify-between gap-7 border-b border-white/5 pb-10 md:flex-row md:items-end">
      <div className="min-w-0">
        <h1 className="font-brand text-[clamp(2.3rem,4.4vw,3.9rem)] font-bold leading-[.92] tracking-[-0.05em] text-white">
          {title}
          {accent ? (
            <>
              <br />
              <span className="text-gradient-accent">{accent}</span>
            </>
          ) : null}
        </h1>
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </header>
  );
}

/**
 * The decorative trio the front page puts inside its cards: a spotlight that
 * fades in on hover, a shine that sweeps across, and a faint ring in the
 * corner. The card using it must be `group relative overflow-hidden`.
 */
export function CardDecor() {
  return (
    <>
      <span className="card-spot" />
      <span className="card-shine" />
      <span className="absolute -right-10 -top-12 h-36 w-36 rounded-full border border-white/5 opacity-20 transition-transform duration-500 group-hover:scale-125" />
    </>
  );
}

/**
 * A section heading in the house's own grammar: a lit icon tile, a Space Grotesk
 * line, and a hairline running out to an optional counter. No eyebrow above it —
 * the line says what the section is.
 */
export function SectionHead({
  icon: Icon,
  title,
  note,
  className = '',
}: {
  icon?: IconType;
  title: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {Icon ? (
        <span className="icon-chip h-11 w-11 shrink-0 text-[#3b82f6]">
          <Icon className="h-5 w-5" />
        </span>
      ) : null}
      <div className="min-w-0">
        <h2 className="font-brand text-2xl font-bold tracking-[-0.03em] text-zinc-100">{title}</h2>
      </div>
      <span className="h-px flex-1 bg-white/5" />
      {note ? (
        <span className="shrink-0 font-mono-ui text-[10px] uppercase tracking-[0.18em] text-zinc-600">{note}</span>
      ) : null}
    </div>
  );
}

/** The front page's primary pill — solid blue, lifts and glows, arrow nudges. */
export function PrimaryLink({
  href,
  children,
  testId,
  onClick,
  className = '',
}: {
  href: string;
  children: ReactNode;
  testId?: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`focus-house group inline-flex items-center gap-2 rounded-full bg-[#3b82f6] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#2563eb] hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] ${className}`}
      data-testid={testId}
    >
      {children}
      <PiArrowUpRightDuotone className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

/** The front page's quiet pill — a hairline and a hover lift, nothing more. */
export function GhostLink({
  href,
  children,
  testId,
  onClick,
  className = '',
}: {
  href: string;
  children: ReactNode;
  testId?: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`focus-house inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white ${className}`}
      data-testid={testId}
    >
      {children}
    </Link>
  );
}

/**
 * The front page's "nothing here yet" card: a lit tile, a display line, a quiet
 * paragraph, and a way out.
 */
export function EmptyPanel({
  icon: Icon,
  title,
  body,
  action,
  className = '',
}: {
  icon: IconType;
  title: string;
  body?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card-surface relative overflow-hidden rounded-2xl p-8 sm:p-10 ${className}`}>
      <span className="icon-chip h-16 w-16 text-[#3b82f6]">
        <Icon className="h-7 w-7" />
      </span>
      <p className="mt-8 font-brand text-4xl font-bold leading-[.95] tracking-[-0.04em] text-zinc-100">{title}</p>
      {body ? <p className="mt-4 max-w-xl text-sm leading-[1.8] text-zinc-500">{body}</p> : null}
      {action ? <div className="mt-8 flex flex-wrap items-center gap-3">{action}</div> : null}
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#0a0a0a] px-6">
        <div className="w-full max-w-md space-y-4" aria-label="Loading Nexet">
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
          <div className="h-12 w-4/5 animate-pulse rounded-xl bg-white/5" />
          <div className="h-5 w-full animate-pulse rounded-full bg-white/5" />
          <div className="h-40 rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Redirect to="/sign-in" />;
  }

  return <PrivateShell>{children}</PrivateShell>;
}

/** Live unread badge for the Inbox nav link. Counts unread notices from both
 * dens (Author Den collaboration + Creators Den video); the app-wide
 * NotificationCenter invalidates both feeds the instant a notification.new
 * streams in, so the number updates without polling or a reload. `overlay`
 * positions the pill on the icon (mobile tab bar) instead of inline. */
function InboxBadge({ overlay = false }: { overlay?: boolean }) {
  const collabQ = useGetCollaborationInbox({
    query: { queryKey: getGetCollaborationInboxQueryKey() },
  });
  const videoQ = useListVideoNotifications({
    query: { queryKey: getListVideoNotificationsQueryKey() },
  });
  const collabUnread = (collabQ.data ?? []).filter((n: any) => !n.read).length;
  const videoUnread = (videoQ.data ?? []).filter((n: any) => !n.readAt).length;
  const count = collabUnread + videoUnread;
  if (count <= 0) return null;
  return (
    <span
      className={`rounded-full bg-red-500 px-1.5 py-0.5 font-mono-ui text-[9px] font-bold leading-none text-white shadow-[0_0_12px_-2px_rgba(239,68,68,0.8)] ${
        overlay ? 'absolute -right-2 -top-1' : 'ml-1.5'
      }`}
      data-testid="nav-inbox-badge"
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}

function UserChip() {
  const { user } = useUser();
  const name = user?.firstName || user?.username || 'Member';
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}` || name.slice(0, 2);

  return (
    <Link
      href="/profile"
      aria-label={`Your profile — ${name}`}
      className="focus-house group flex max-w-[15rem] min-w-0 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] p-1 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06] lg:pr-3"
      data-testid="link-profile-chip"
    >
      {user?.imageUrl ? (
        <img
          src={user.imageUrl}
          alt=""
          className="h-7 w-7 shrink-0 rounded-full object-cover shadow-[0_0_18px_-4px_rgba(59,130,246,0.7)]"
          data-testid="link-profile-chip-avatar"
        />
      ) : (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] font-mono-ui text-[10px] font-medium uppercase text-white shadow-[0_0_18px_-4px_rgba(59,130,246,0.7)]">
          {initials}
        </span>
      )}
      {/* The name and address only appear once the bar has room for them —
          below that the chip is the avatar alone, and the label carries what
          the hidden text would have said. */}
      <span className="hidden min-w-0 text-left lg:block">
        <span className="block truncate text-xs font-semibold text-zinc-100" data-testid="text-user-name">{name}</span>
        <span className="block truncate text-[10px] text-zinc-500">{user?.primaryEmailAddress?.emailAddress || 'Nexet member'}</span>
      </span>
    </Link>
  );
}

function PrivateShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut } = useClerk();

  const logout = () => signOut({ redirectUrl: '/' });

  return (
    <div className="relative min-h-[100dvh] bg-[#0a0a0a] text-zinc-100">
      {/* The same top glow the public pages open with, so the private house
          reads as the same place once you are inside it. */}
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[480px]" />
      {/* Floating pill nav — same treatment as the home page's HouseNav: the
          bar is a rounded, blurred, border-lit card floating under the top
          edge instead of a full-width strip. */}
      <header className="sticky top-0 z-30">
        <div className="mx-auto w-full max-w-[1400px] px-4 pt-3 sm:px-5 sm:pt-4 lg:px-6">
          <div className="relative flex h-[72px] items-center gap-4 rounded-2xl border border-white/10 bg-[#0d0d0d]/85 px-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_12px_40px_-16px_rgba(0,0,0,0.9),0_0_50px_-20px_rgba(59,130,246,0.45)] backdrop-blur-xl sm:px-5">
            <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/40 to-transparent" />
            <NexetLogo />

            {/* Desktop nav — one segmented control, the same grammar the front
                page's header uses: a bordered pill group whose current room is
                lit from inside rather than underlined. */}
            <nav className="hidden min-w-0 flex-1 items-center justify-center md:flex" aria-label="Private navigation">
              <div className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.04] p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                {desktopNav.map((item) => {
                  const Icon = item.icon;
                  const active = location === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`focus-house group relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'bg-[#3b82f6]/15 text-white shadow-[inset_0_0_0_1px_rgba(59,130,246,0.4),inset_0_1px_0_0_rgba(255,255,255,0.12)]'
                          : 'text-zinc-400 hover:bg-white/[0.07] hover:text-white'
                      }`}
                      data-testid={`link-nav-${item.label.toLowerCase()}`}
                    >
                      <Icon className={`h-4 w-4 transition-colors ${active ? 'text-[#60a5fa]' : 'text-zinc-500 group-hover:text-zinc-200'}`} />
                      {item.label}
                      {item.label === 'Inbox' && <InboxBadge />}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Right cluster — the account pill, then the way out. Signing out is
                neutral until you reach for it, so the header keeps one loud
                thing at a time. */}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <UserChip />
              {/* Icon at rest; the word slides out of it on hover or keyboard
                  focus, so the header stays quiet and the way out is still
                  spelled out the moment you reach for it. The label is clipped
                  rather than removed, so it always names the button. */}
              <button
                type="button"
                onClick={logout}
                aria-label="Sign out"
                className="focus-house group hidden items-center rounded-full border border-white/10 p-2.5 text-xs font-medium text-zinc-300 transition-colors duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 sm:flex"
                data-testid="button-header-logout"
              >
                <PiSignOutDuotone className="h-4 w-4 shrink-0 text-red-400 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-red-300" />
                <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-out group-hover:max-w-[5.5rem] group-hover:pl-2 group-hover:opacity-100 group-focus-visible:max-w-[5.5rem] group-focus-visible:pl-2 group-focus-visible:opacity-100">
                  Sign out
                </span>
              </button>
              <button type="button" onClick={() => setMenuOpen((open) => !open)} className="focus-house rounded-lg border border-white/10 p-2.5 md:hidden" aria-label="Open menu" data-testid="button-mobile-profile-menu">
                {menuOpen ? <PiXDuotone className="h-4 w-4" /> : <PiListDuotone className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown menu — same card treatment as the home page */}
          {menuOpen && (
            <div className="absolute inset-x-4 top-[88px] rounded-2xl border border-white/10 bg-[#0d0d0d]/95 p-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_24px_60px_-20px_rgba(0,0,0,0.95),0_0_60px_-24px_rgba(59,130,246,0.5)] backdrop-blur-xl sm:inset-x-8 md:hidden lg:inset-x-10">
              <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/50 to-transparent" />
              {mobileNav.map((item) => {
                const Icon = item.icon;
                const active = location === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={active ? 'page' : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${active ? 'bg-[#3b82f6]/15 text-white' : 'text-zinc-300 hover:bg-white/5 hover:text-white'}`} data-testid={`link-mobile-nav-${item.label.toLowerCase()}`}>
                    <span className={`icon-chip h-9 w-9 shrink-0 ${active ? 'text-[#60a5fa]' : 'text-zinc-400'}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    {item.label}
                    {item.label === 'Inbox' && <InboxBadge />}
                  </Link>
                );
              })}
              <div className="my-1 h-px bg-white/5" />
              <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-zinc-300 transition-colors hover:bg-red-500/10 hover:text-red-300" data-testid="button-mobile-logout">
                <span className="icon-chip h-9 w-9 shrink-0 text-red-400">
                  <PiSignOutDuotone className="h-4 w-4" />
                </span>
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/5 bg-[#0d0d0d]/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-lg md:hidden" aria-label="Mobile navigation">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const active = location === item.href;
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={`focus-house group flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium transition-colors ${active ? 'text-[#60a5fa]' : 'text-zinc-500'}`} data-testid={`link-mobile-${item.label.toLowerCase()}`}>
                <span className={`relative flex h-7 w-12 items-center justify-center rounded-full transition-colors ${active ? 'bg-[#3b82f6]/15 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.3)]' : ''}`}>
                  <Icon className={`h-5 w-5 ${active ? 'text-[#60a5fa]' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  {item.label === 'Inbox' && <InboxBadge overlay />}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="relative mx-auto max-w-[1400px] px-4 py-10 sm:px-5 lg:px-6 lg:pb-14">{children}</main>
    </div>
  );
}
