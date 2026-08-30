import { NavLink } from 'react-router-dom';
import './Header.css';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  return (
    <header className="site-header">
      <NavLink to="/" className="brand">
        <span className="brand-mark" />
        <span className="brand-name">Krish AI Labs</span>
      </NavLink>
      <nav className="site-nav">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <NavLink to="/contact" className="btn btn-primary header-cta">
        Get a Quote
      </NavLink>
    </header>
  );
}
