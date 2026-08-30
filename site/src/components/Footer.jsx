import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <>
      <footer className="site-footer container">
        <div className="footer-brand">
          <span className="footer-brand-name">Krish AI Labs</span>
          <span className="footer-tagline">Building Intelligent Software for the Future</span>
          <span className="footer-email">hello@krishailabs.com</span>
        </div>
        <div className="footer-columns">
          <div className="footer-column">
            <span className="footer-column-label">Company</span>
            <Link to="/about">About</Link>
            <Link to="/portfolio">Portfolio</Link>
          </div>
          <div className="footer-column">
            <span className="footer-column-label">Work With Us</span>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
      <div className="footer-copyright">&copy; 2026 Krish AI Labs. All rights reserved.</div>
    </>
  );
}
