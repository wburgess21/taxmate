"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Menu, X } from "lucide-react";

type Item = { href: string; label: string };

/**
 * The nav on phones and small tablets: a button that opens a panel under the bar. Radix Dialog handles focus,
 * Escape and tapping outside; the panel closes itself after navigating.
 */
export function MobileMenu({ links, extra, guides }: { links: Item[]; extra: Item[]; guides: Item[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Close when the route changes (a link was followed).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="menu-button md:hidden" aria-label={open ? "Close menu" : "Open menu"}>
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="menu-overlay md:hidden" />
        <Dialog.Content className="menu-panel md:hidden" aria-describedby={undefined}>
          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          <nav aria-label="Site">
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="menu-link" aria-current={pathname === l.href ? "page" : undefined}>
                    {l.label}
                    <ArrowRight className="h-4 w-4 text-muted" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="kicker mt-5 px-1">Guides for</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {guides.map((g) => <li key={g.href}><Link href={g.href} className="check">{g.label}</Link></li>)}
            </ul>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-hairline px-1 pt-4 text-[0.9375rem] text-muted">
              {extra.map((l) => <li key={l.href}><Link href={l.href} className="transition-colors hover:text-ink">{l.label}</Link></li>)}
            </ul>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
