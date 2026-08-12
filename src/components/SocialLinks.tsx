import { SOCIALS } from '../lib/site';
import { SocialIcon } from './icons';

export default function SocialLinks() {
  return (
    <ul className="flex items-center gap-1">
      {SOCIALS.filter((s) => s.href).map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            aria-label={social.label}
            title={social.label}
            target="_blank"
            rel="me noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <SocialIcon icon={social.icon} className="h-[18px] w-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
