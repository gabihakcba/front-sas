'use client';

import Image from 'next/image';
import { Button } from 'primereact/button';

interface TopBarProps {
  onMenuToggle: () => void;
}

/**
 * TopBar component for mobile navigation
 * Features:
 * - Only visible on mobile (md:hidden)
 * - Hamburger menu button to toggle drawer
 * - Logo and title
 * - Theme-aware styling
 */
export function TopBar({ onMenuToggle }: TopBarProps) {
  return (
    <header className="md:hidden h-16 bg-surface-card border-b border-surface-border flex items-center px-4 gap-3">
      {/* Hamburger Menu Button */}
      <Button
        icon="pi pi-bars"
        iconPos="right"
        text
        severity="secondary"
        onClick={onMenuToggle}
        className="p-button-sm"
        aria-label="Toggle menu"
      />

      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/scout.png"
          alt="Scout Logo"
          width={32}
          height={32}
          className="opacity-90"
        />
        <div>
          <h1 className="text-text-main font-bold text-sm">Scout SAS</h1>
        </div>
      </div>
    </header>
  );
}
