import { Link } from 'react-router-dom';

export default function CtaBand({ title, description, ctaLabel = 'Get a Quote' }) {
  return (
    <section className="cta-band">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <Link to="/contact" className="btn btn-primary">
        {ctaLabel}
      </Link>
    </section>
  );
}
