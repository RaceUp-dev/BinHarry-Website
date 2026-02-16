'use client';

import { useState } from 'react';
import Link from 'next/link';
import { products, categories, type Product } from '@/data/products';
import './boutique.css';

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <div className="product-image">
        {product.isNew && <span className="product-badge">NOUVEAU</span>}
        {!product.inStock && <span className="product-badge product-badge-out">RUPTURE</span>}
        <span className="product-placeholder">Image produit</span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.variant && <span className="product-variant">{product.variant}</span>}
        <span className="product-price">{product.price} €</span>
        {product.sizes && (
          <div className="product-sizes">
            {product.sizes.map((size) => (
              <span key={size} className="product-size">{size}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BoutiquePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');

  const filteredProducts = products
    .filter((p) => selectedCategory === 'all' || p.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="boutique-page">
      <div className="boutique-header">
        <div className="boutique-breadcrumb">
          <Link href="/">Accueil</Link>
          <span>/</span>
          <span>Boutique</span>
        </div>
        <h1 className="boutique-title">Boutique BinHarry</h1>
        <p className="boutique-subtitle">
          Découvre notre collection de vêtements et goodies aux couleurs du BDE !
        </p>
      </div>

      <div className="boutique-content">
        <aside className="boutique-filters">
          <div className="filter-section">
            <h3>Catégories</h3>
            <div className="filter-options">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Trier par</h3>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="name">Nom</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </aside>

        <main className="boutique-products">
          <div className="products-header">
            <span className="products-count">{filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}</span>
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="products-empty">
              <p>Aucun produit dans cette catégorie.</p>
            </div>
          )}
        </main>
      </div>

      <section className="boutique-info">
        <div className="info-card">
          <div className="info-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h4>Retrait sur place</h4>
          <p>Récupère ta commande directement au local du BDE</p>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4>Paiement flexible</h4>
          <p>Espèces, Lydia ou carte bancaire</p>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <h4>Pour les adhérents</h4>
          <p>Réductions exclusives pour les membres du BDE</p>
        </div>
      </section>

      <div className="boutique-contact">
        <h3>Une question ?</h3>
        <p>Contacte-nous sur <a href="https://discord.gg/wXpRMds6BC" target="_blank" rel="noopener noreferrer">Discord</a> ou par mail pour toute question sur les commandes.</p>
      </div>
    </div>
  );
}
