import './Contact.css';

export default function Contact() {
  return (
    <section className="contact-section">
      <div>
        <span className="pill">Contact</span>
        <h1 className="contact-title">Let's talk about your project</h1>
        <p className="contact-description">
          Tell us what you're building. We typically respond within a day.
        </p>
        <div className="contact-details">
          <div>
            <span className="contact-details-label">Email</span>
            <span className="contact-details-value">hello@krishailabs.com</span>
          </div>
          <div>
            <span className="contact-details-label">Response time</span>
            <span className="contact-details-value">Within 24 hours</span>
          </div>
        </div>
      </div>
      <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
        <div className="contact-field">
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" type="text" placeholder="Your name" />
        </div>
        <div className="contact-field">
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" type="email" placeholder="you@company.com" />
        </div>
        <div className="contact-field">
          <label htmlFor="contact-message">What are you building?</label>
          <textarea id="contact-message" rows="4" placeholder="Tell us about your project" />
        </div>
        <button type="submit" className="btn btn-primary contact-submit">
          Send Message
        </button>
      </form>
    </section>
  );
}
