import PageHero from '../components/PageHero';
import CtaBand from '../components/CtaBand';
import './Portfolio.css';

const PROJECTS = [
  {
    tag: 'Sample Project · RAG',
    accent: 'cyan',
    title: 'Internal Knowledge Assistant',
    description:
      'A retrieval-augmented chat assistant that answers employee questions by searching company wikis, PDFs, and Slack history, citing sources for every answer.',
    stack: 'Python · LangChain · vector database · React',
    artFirst: true,
  },
  {
    tag: 'Sample Project · Agents',
    accent: 'violet',
    title: 'AI Customer Support Agent',
    description:
      'An agent that triages incoming support tickets, resolves common questions automatically, and hands off complex cases to a human with full context.',
    stack: 'Node.js · LLM agent framework · webhooks',
    artFirst: false,
  },
  {
    tag: 'Sample Project · SaaS',
    accent: 'cyan',
    title: 'SaaS Operations Dashboard',
    description:
      'A full-stack analytics dashboard for tracking operational metrics, deployed on cloud infrastructure with automated CI/CD and monitoring.',
    stack: 'React · PostgreSQL · AWS · Docker',
    artFirst: true,
  },
];

export default function Portfolio() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Sample projects"
        description="Krish AI Labs is a new studio. These are illustrative sample builds showing the kind of work we do — not delivered client engagements."
        maxWidth={1200}
        paddingBottom={60}
      />

      <section className="project-list">
        {PROJECTS.map((project) => (
          <div className="project-row" key={project.title}>
            {project.artFirst && <div className="project-art placeholder-art">product screenshot</div>}
            <div className="project-body">
              <span className={`project-tag project-tag-${project.accent}`}>{project.tag}</span>
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <p className="project-stack">{project.stack}</p>
            </div>
            {!project.artFirst && <div className="project-art placeholder-art">product screenshot</div>}
          </div>
        ))}
      </section>

      <CtaBand title="Have a project in mind?" description="Let's talk through what you're building." />
    </>
  );
}
