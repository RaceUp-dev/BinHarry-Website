import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>BinHarry</h3>
          <p>BDE du BUT Informatique de Reims</p>
        </div>
        
        <div className="footer-section">
          <h4>Liens utiles</h4>
          <nav className="footer-nav">
            <Link href="/mentions-legales">Mentions Légales</Link>
            <Link href="/cgv">CGV</Link>
          </nav>
        </div>
        
        <div className="footer-section">
          <h4>Communauté</h4>
          <a 
            href="https://discord.gg/wXpRMds6BC" 
            target="_blank" 
            rel="noopener noreferrer"
            className="discord-link"
          >
            Rejoindre notre Discord
          </a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BinHarry. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
