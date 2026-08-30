import PageHero from '../components/PageHero';
import CtaBand from '../components/CtaBand';
import './About.css';

export default function About() {
  return (
    <>
      <PageHero eyebrow="About" title="Meet the founder" maxWidth={1000} paddingBottom={60} />

      <section className="founder-section">
        <div className="founder-photo placeholder-art">founder photo</div>
        <div>
          <h2 className="founder-name">Heena Zala</h2>
          <p className="founder-role">Founder &amp; Software Engineer</p>
          <p className="founder-bio">
            Heena Zala is a software engineer and the founder of Krish AI Labs, with 4 years of
            experience building modern software applications and digital solutions.
          </p>
          <p className="founder-bio">
            Her work focuses on full-stack software development, scalable web applications, backend
            services, and emerging AI-powered solutions &mdash; turning business ideas into working
            products.
          </p>
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">What We Do</h2>
        <p className="about-copy">
          Krish AI Labs is a software development and IT consultancy studio built around one idea:
          intelligent software should be practical, not just impressive. We build full-stack
          applications, integrate AI where it genuinely helps, and advise teams on the technical
          decisions that matter.
        </p>
        <p className="about-copy about-copy-last">
          Whether you need a product built from scratch, an AI feature added to an existing system,
          or an outside perspective on your architecture, we work as a hands-on technical partner.
        </p>
      </section>

      <CtaBand title="Let's talk about your project." />
    </>
  );
}
