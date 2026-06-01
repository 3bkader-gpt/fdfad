'use client';

import { useState } from 'react';

interface AnimatedOrderButtonProps {
  onClick: () => Promise<void> | void;
  idleLabel: string;
  successLabel: string;
  className?: string;
  disabled?: boolean;
}

export function AnimatedOrderButton({
  onClick,
  idleLabel,
  successLabel,
  className = '',
  disabled = false,
}: AnimatedOrderButtonProps) {
  const [state, setState] = useState<'idle' | 'driving' | 'success'>('idle');

  const handleClick = async () => {
    if (state !== 'idle' || disabled) return;

    // Trigger business logic
    await onClick();

    // Start animation
    setState('driving');

    // Simulate/Wait for delivery animation (matching the CSS duration)
    setTimeout(() => {
      setState('success');
    }, 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || state !== 'idle'}
      className={`luxury-order-btn ${state === 'driving' ? 'is-driving' : ''} ${state === 'success' ? 'is-success' : ''} ${className}`}
      aria-label={state === 'success' ? successLabel : idleLabel}
    >
      {/* 1. Default Label */}
      <span className="luxury-order-btn__label">{state === 'idle' ? idleLabel : ''}</span>

      {/* 2. Animation Scene (Truck) */}
      <div className="luxury-order-btn__scene" aria-hidden="true">
        <div className="luxury-truck">
          <svg
            width="74"
            height="36"
            viewBox="0 0 74 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cargo box - Evergreen Theme */}
            <rect x="2" y="6" width="38" height="24" rx="2" className="fill-brand-primary" />
            <rect
              x="2"
              y="6"
              width="38"
              height="24"
              rx="2"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-white/20"
            />
            <line
              x1="28"
              y1="7"
              x2="28"
              y2="29"
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              opacity="0.3"
            />
            {/* Package - Sand Theme */}
            <rect
              x="8"
              y="11"
              width="14"
              height="13"
              rx="1"
              className="fill-brand-accent"
              opacity="0.6"
            />
            <line x1="15" y1="11" x2="15" y2="24" stroke="white" strokeWidth="0.5" opacity="0.4" />
            {/* Cab */}
            <path d="M40 10 L54 10 L62 18 L62 30 L40 30 Z" className="fill-brand-primary" />
            <path
              d="M40 10 L54 10 L62 18 L62 30 L40 30 Z"
              stroke="white"
              strokeWidth="0.5"
              opacity="0.2"
            />
            <path d="M43 12 L53 12 L60 18 L43 18 Z" fill="white" opacity="0.2" />
            <rect x="2" y="28" width="64" height="4" rx="1" fill="#1A1A1A" />
            {/* Wheels */}
            <g className="luxury-wheel" style={{ transformOrigin: '16px 33px' }}>
              <circle
                cx="16"
                cy="33"
                r="5"
                fill="#111"
                stroke="currentColor"
                strokeWidth="1"
                className="text-brand-accent/40"
              />
              <line
                x1="16"
                y1="28.5"
                x2="16"
                y2="37.5"
                stroke="white"
                strokeWidth="0.5"
                opacity="0.2"
              />
              <line
                x1="11.5"
                y1="33"
                x2="20.5"
                y2="33"
                stroke="white"
                strokeWidth="0.5"
                opacity="0.2"
              />
            </g>
            <g className="luxury-wheel" style={{ transformOrigin: '52px 33px' }}>
              <circle
                cx="52"
                cy="33"
                r="5"
                fill="#111"
                stroke="currentColor"
                strokeWidth="1"
                className="text-brand-accent/40"
              />
              <line
                x1="52"
                y1="28.5"
                x2="52"
                y2="37.5"
                stroke="white"
                strokeWidth="0.5"
                opacity="0.2"
              />
              <line
                x1="47.5"
                y1="33"
                x2="56.5"
                y2="33"
                stroke="white"
                strokeWidth="0.5"
                opacity="0.2"
              />
            </g>
            <rect x="61" y="20" width="3" height="5" rx="1" className="fill-brand-accent" />
          </svg>
        </div>
      </div>

      {/* 3. Success Message */}
      <div className="luxury-order-btn__success" aria-live="polite">
        <svg className="h-4 w-4" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polyline
            points="2,7 5,10 11,3"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{successLabel}</span>
      </div>
    </button>
  );
}
