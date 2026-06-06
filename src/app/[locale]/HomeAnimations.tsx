'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HomeAnimationsProps {
  children: React.ReactNode;
}

export function HomeAnimations({ children }: HomeAnimationsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const title = containerRef.current?.querySelector('h1');
    const subtitle = containerRef.current?.querySelector('p');
    const collection = containerRef.current?.querySelector('#collection');
    const cta = containerRef.current?.querySelector('a[href="#collection"]');

    if (title && subtitle && collection) {
      const tl = gsap.timeline();
      tl.from(title, {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
      }).from(
        subtitle,
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.8',
      );

      if (cta) {
        tl.from(
          cta,
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.6',
        );
      }

      tl.from(
        collection,
        {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: 'power2.out',
        },
        '-=0.4',
      );
    }
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
