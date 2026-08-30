import { Link } from 'react-router-dom';
import CtaBand from '../components/CtaBand';
import './Home.css';

const SERVICES = [
  {
    tag: 'AI',
    accent: 'violet',
    title: 'AI & GenAI Development',
    description: 'LLM-powered features, copilots, and generative tools built into your product.',
  },
  {
    tag: 'FS',
    accent: 'cyan',
    title: 'Full-Stack Development',
    description: 'End-to-end web and SaaS applications, from database to interface.',
  },
  {
    tag: 'AG',
    accent: 'violet',
    title: 'AI Agents & Automation',
    description: 'Autonomous agents that handle workflows, support, and repetitive tasks.',
  },
  {
    tag: 'RAG',
    accent: 'cyan',
    title: 'RAG & LLM Applications',
    description: 'Retrieval-augmented systems that ground AI answers in your own data.',
  },
  {
    tag: 'CL',
    accent: 'violet',
    title: 'Cloud Solutions',
    description: 'Scalable, secure infrastructure and deployment on AWS, GCP, or Azure.',
  },
  {
    tag: 'TC',
    accent: 'cyan',
    title: 'Technical Consulting',
    description: 'Architecture reviews, tech strategy, and hands-on IT advisory.',
  },
];

const PROCESS_STEPS = [
  { number: '01', title: 'Discover', description: 'Understand your goals, users, and technical constraints.' },
  { number: '02', title: 'Design', description: 'Architect the system and map out the build plan.' },
  { number: '03', title: 'Build', description: 'Ship in iterative cycles, with regular working demos.' },
  { number: '04', title: 'Deploy & Support', description: 'Launch to production and stay on for iteration and support.' },
];

const SAMPLE_WORK = [
  {
    title: 'RAG Knowledge Assistant',
    description: 'Internal search assistant grounded in company documents.',
  },
  {
    title: 'AI Support Agent',
    description: 'Automated first-line customer support with human handoff.',
  },
  {
    title: 'SaaS Ops Dashboard',
    description: 'Full-stack dashboard with cloud deployment and monitoring.',
  },
];

const INSIGHTS = [
  {
    title: 'When to Use RAG vs. Fine-Tuning',
    description: 'A practical breakdown of when grounding an LLM in your own data beats retraining it.',
  },
  {
    title: 'Designing Reliable AI Agents',
    description: 'Patterns for keeping autonomous agents predictable in production.',
  },
  {
    title: 'Shipping SaaS on a Startup Budget',
    description: 'Choosing a cloud stack that scales without overpaying on day one.',
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-glow hero-glow-violet" />
        <div className="hero-glow hero-glow-cyan" />
        <div className="hero-content">
          <span className="pill">AI &amp; Software Engineering Studio</span>
          <h1 className="hero-title">
            Building Intelligent Software
            <br />
            for the Future
          </h1>
          <p className="hero-description">
            Krish AI Labs designs and builds full-stack applications, AI agents, and RAG-powered
            products &mdash; from first prototype to cloud-scale deployment.
          </p>
          <div className="hero-actions">
            <Link to="/contact" className="btn btn-primary">
              Get a Quote
            </Link>
            <Link to="/portfolio" className="btn btn-secondary">
              View Our Work
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading-row">
          <h2 className="section-title">What We Do</h2>
          <Link to="/services" className="section-link">
            See all services &rarr;
          </Link>
        </div>
        <div className="services-grid">
          {SERVICES.map((service) => (
            <div className="service-card" key={service.title}>
              <div className={`service-icon service-icon-${service.accent}`}>{service.tag}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2 className="section-title section-title-center">How We Work</h2>
        <div className="process-grid">
          {PROCESS_STEPS.map((step) => (
            <div key={step.number}>
              <div className="process-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading-row">
          <h2 className="section-title">Sample Work</h2>
          <Link to="/portfolio" className="section-link">
            See all projects &rarr;
          </Link>
        </div>
        <div className="work-grid">
          {SAMPLE_WORK.map((item) => (
            <div className="work-card" key={item.title}>
              <div className="work-card-art placeholder-art">product screenshot</div>
              <div className="work-card-body">
                <span className="work-card-tag">Sample Project</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2 className="section-title section-title-center">Insights</h2>
        <div className="insights-grid">
          {INSIGHTS.map((insight) => (
            <div className="insight-card" key={insight.title}>
              <h3>{insight.title}</h3>
              <p>{insight.description}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBand
        title="Let's build something intelligent."
        description="Tell us about your project and we'll get back to you within a day."
      />
    </>
  );
}
