import PageHero from '../components/PageHero';
import CtaBand from '../components/CtaBand';
import './Services.css';

const SERVICES = [
  {
    tag: 'AI',
    accent: 'violet',
    title: 'AI & GenAI Development',
    description:
      'We design and build generative AI features — from chat copilots to content and code generation tools — using the latest large language models, integrated directly into your product.',
    stack: 'LLM integration · prompt engineering · copilots · content generation',
  },
  {
    tag: 'FS',
    accent: 'cyan',
    title: 'Full-Stack Software Development',
    description:
      'Complete web and SaaS applications — frontend, backend, database, and APIs — built to be maintainable and to scale as your product grows.',
    stack: 'Web apps · APIs · databases · SaaS platforms',
  },
  {
    tag: 'AG',
    accent: 'violet',
    title: 'AI Agents & Automation',
    description:
      'Autonomous agents that carry out multi-step tasks — triaging support tickets, processing documents, or running workflows — with human oversight where it matters.',
    stack: 'Task automation · agent orchestration · workflow tooling',
  },
  {
    tag: 'RAG',
    accent: 'cyan',
    title: 'RAG & LLM Applications',
    description:
      'Retrieval-augmented generation systems that ground model answers in your own documents, data, and internal knowledge — reducing hallucination and keeping answers current.',
    stack: 'Vector search · knowledge bases · document Q&A',
  },
  {
    tag: 'CL',
    accent: 'violet',
    title: 'Cloud Solutions',
    description:
      'Cloud architecture, deployment, and DevOps — setting up infrastructure that stays reliable and cost-efficient as usage scales.',
    stack: 'AWS · GCP · Azure · CI/CD · infrastructure as code',
  },
  {
    tag: 'TC',
    accent: 'cyan',
    title: 'Technical Consulting',
    description:
      'Independent advisory on architecture, technology choices, and AI strategy — helping teams make sound decisions before committing engineering time.',
    stack: 'Architecture review · tech strategy · IT advisory',
  },
];

export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Software and AI expertise, end to end."
        description="From first prototype to production infrastructure — we cover the full stack, plus the AI layer on top of it."
        maxWidth={1200}
        paddingBottom={80}
      />

      <section className="services-list">
        {SERVICES.map((service) => (
          <div className="service-row" key={service.title}>
            <div className={`service-row-icon service-icon-${service.accent}`}>{service.tag}</div>
            <div>
              <h3>{service.title}</h3>
              <p className="service-row-description">{service.description}</p>
              <p className="service-row-stack">{service.stack}</p>
            </div>
          </div>
        ))}
      </section>

      <CtaBand
        title="Not sure which service fits?"
        description="Tell us what you're building and we'll recommend an approach."
      />
    </>
  );
}
