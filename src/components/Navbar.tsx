'use client';

import Link from 'next/link';

export default function Navbar() {
  // Note: Cette navbar sera étendue pour inclure la gestion de compte utilisateur
  return (
    <header className="navbar">
      <div className="navbar-content">
        <Link href="/" className="navbar-logo">
          BinHarry
        </Link>
        
        <nav className="navbar-nav">
          <Link href="/">Accueil</Link>
          {/* Espace réservé pour le compte utilisateur futur */}
          <div className="navbar-user">
            {/* TODO: Implémenter la gestion de compte utilisateur */}
          </div>
        </nav>
      </div>
    </header>
  );
}
