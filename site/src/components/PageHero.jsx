import './PageHero.css';

export default function PageHero({ eyebrow, title, description, maxWidth = 1200, paddingBottom = 60 }) {
  return (
    <section
      className="page-hero container"
      style={{ maxWidth, paddingBottom }}
    >
      <span className="pill">{eyebrow}</span>
      <h1 className="page-hero-title">{title}</h1>
      {description && <p className="page-hero-description">{description}</p>}
    </section>
  );
}
