'use client';

import * as React from 'react';
import Link from 'next/link';

import { Menu } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import { ThemeToggle } from '@/components/theme-toggle';

import { navItems } from '@/data';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading font-semibold text-foreground"
        >
          📄
          <span>Nobins</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Link href="/new">
            <Button size="sm" className="hidden md:inline-flex">
              New paste
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'md:hidden')}
            >
              <Menu className="size-5" />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.href}>
                  <Link href={item.href} className="w-full">
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem>
                <Link href="/new" className="w-full">
                  New paste
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
