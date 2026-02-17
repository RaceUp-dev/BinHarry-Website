import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos | BinHarry - BDE du BUT Informatique de Reims',
  description: 'Découvrez BinHarry, le Bureau Des Étudiants du BUT Informatique de Reims. Notre mission, notre équipe et nos valeurs.',
  openGraph: {
    title: 'À propos | BinHarry',
    description: 'Découvrez BinHarry, le Bureau Des Étudiants du BUT Informatique de Reims.',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
