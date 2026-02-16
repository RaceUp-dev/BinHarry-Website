import type { Metadata } from 'next';
import './about.css';

export const metadata: Metadata = {
  title: 'À propos | BinHarry - BDE du BUT Informatique de Reims',
  description: 'Découvrez BinHarry, le Bureau Des Étudiants du BUT Informatique de Reims. Notre mission, notre équipe et nos valeurs.',
  openGraph: {
    title: 'À propos | BinHarry',
    description: 'Découvrez BinHarry, le Bureau Des Étudiants du BUT Informatique de Reims.',
  },
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <h1>À propos de BinHarry</h1>
        <p className="about-hero-subtitle">Le Bureau Des Étudiants du BUT Informatique de Reims</p>
      </section>

      <section className="about-section">
        <h2>Notre Mission</h2>
        <p>
          BinHarry est l&apos;association étudiante qui anime la vie du BUT Informatique à l&apos;IUT de Reims. 
          Notre objectif est de créer une communauté soudée, d&apos;organiser des événements mémorables et 
          d&apos;accompagner les étudiants tout au long de leur parcours.
        </p>
      </section>

      <section className="about-section">
        <h2>Ce que nous faisons</h2>
        <div className="about-features">
          <div className="about-feature">
            <div className="about-feature-icon">🎉</div>
            <h3>Événements</h3>
            <p>Soirées, sorties, tournois gaming et bien plus encore pour renforcer les liens entre étudiants.</p>
          </div>
          <div className="about-feature">
            <div className="about-feature-icon">📚</div>
            <h3>Tutorat</h3>
            <p>Entraide entre étudiants pour réussir ensemble. Les anciens accompagnent les nouveaux.</p>
          </div>
          <div className="about-feature">
            <div className="about-feature-icon">🛒</div>
            <h3>Boutique</h3>
            <p>Goodies, vêtements et accessoires aux couleurs de BinHarry pour afficher ton appartenance.</p>
          </div>
          <div className="about-feature">
            <div className="about-feature-icon">💬</div>
            <h3>Communauté</h3>
            <p>Un Discord actif pour échanger, poser des questions et ne rien rater des actualités.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Nous rejoindre</h2>
        <p>
          Tu es étudiant au BUT Informatique de Reims ? Rejoins-nous ! L&apos;adhésion annuelle est à seulement 5€ 
          et te donne accès à tous nos événements et avantages exclusifs.
        </p>
        <div className="about-cta">
          <a href="/auth" className="about-btn about-btn-primary">Créer un compte</a>
          <a href="https://discord.gg/wXpRMds6BC" target="_blank" rel="noopener noreferrer" className="about-btn about-btn-secondary">
            Rejoindre le Discord
          </a>
        </div>
      </section>

      <section className="about-section">
        <h2>Contact</h2>
        <p>
          Une question ? Une suggestion ? N&apos;hésite pas à nous contacter par email à{' '}
          <a href="mailto:bdebinharry@gmail.com">bdebinharry@gmail.com</a> ou directement sur notre Discord.
        </p>
      </section>
    </main>
  );
}
