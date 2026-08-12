export const SITE = {
  title: 'Jônata Albuquerque',
  name: 'Jônata Albuquerque',
  tagline:
    'Notas de engenharia de software: ferramentas, arquitetura e decisões técnicas.',
  description:
    'Notas práticas de engenharia e design de software: arquitetura, ferramentas e boas decisões, em português.',
  url: 'https://jnta.github.io',
  email: 'jonata.a@outlook.com',
  lang: 'pt-BR',
};

export type SocialLink = {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'x' | 'rss' | 'email';
};

export const SOCIALS: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/jnta', icon: 'github' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jonataalbuquerque/',
    icon: 'linkedin',
  },
  { label: 'X', href: '', icon: 'x' },
  { label: 'RSS', href: '/rss.xml', icon: 'rss' },
];
