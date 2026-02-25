import './contact.css';

export default function ContactPage() {
  return (
    <main className="contact-page">
      <section className="contact-card">
        <h1>Contact</h1>
        <p>
          Nous sommes ouverts a toute collaboration, et disponibles pour repondre a vos questions.
        </p>

        <ul className="contact-list">
          <li>
            <span>Email</span>
            <a href="mailto:bdebinharry@gmail.com">bdebinharry@gmail.com</a>
          </li>
          <li>
            <span>Discord</span>
            <a href="https://discord.gg/wXpRMds6BC" target="_blank" rel="noopener noreferrer">
              discord.gg/wXpRMds6BC
            </a>
          </li>
          <li>
            <span>Telephone</span>
            <a href="tel:0612461843">0612461843</a>
          </li>
        </ul>
      </section>
    </main>
  );
}
