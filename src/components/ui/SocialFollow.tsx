'use client';

import { FacebookIcon, InstagramIcon, WhatsAppIcon, TikTokIcon } from './Icons';
import { FACEBOOK_URL, INSTAGRAM_URL, WHATSAPP_URL, TIKTOK_URL } from '@/data/site';
import { useTranslations } from 'next-intl';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export function SocialFollow() {
  const t = useTranslations('Nav');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.social-reveal', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-bg-elevated/30 border-border-color border-y px-6 py-20 text-center transition-colors duration-300"
    >
      <div className="mx-auto max-w-xl">
        <h2 className="social-reveal text-text-primary mb-12 font-serif text-3xl font-medium tracking-tight italic">
          {t('explore')}
        </h2>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <SocialButton
            href={WHATSAPP_URL}
            label="WhatsApp"
            icon={<WhatsAppIcon className="social-expand-icon" />}
            className="social-whatsapp"
          />
          <SocialButton
            href={INSTAGRAM_URL}
            label="Instagram"
            icon={<InstagramIcon className="social-expand-icon" />}
            className="social-instagram"
          />
          <SocialButton
            href={FACEBOOK_URL}
            label="Facebook"
            icon={<FacebookIcon className="social-expand-icon" />}
            className="social-facebook"
          />
          <SocialButton
            href={TIKTOK_URL}
            label="TikTok"
            icon={<TikTokIcon className="social-expand-icon" />}
            className="social-tiktok"
          />
        </div>
      </div>
    </section>
  );
}

function SocialButton({
  href,
  label,
  icon,
  className,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`social-expand-btn social-reveal ${className}`}
    >
      {icon}
      <span className="social-expand-text">{label}</span>
    </a>
  );
}
