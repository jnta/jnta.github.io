export const SITE = {
  title: 'Jônata Albuquerque',
  name: 'Jônata Albuquerque',
  tagline:
    'Explorando Engenharia de Software: Ferramentas, Arquitetura, Soluções e Melhores práticas',
  description:
    'Notas de engenharia e design de software: ferramentas, arquitetura, soluções e melhores práticas.',
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
