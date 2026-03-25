import Link from "next/link";

const FACTS = [
  {
    title: "AI products are shifting from features to operating layers",
    description:
      "The strongest products increasingly hide AI inside the workflow itself, turning intelligence into infrastructure instead of a visible destination.",
    relatedTitle: "The Shift from AI Tools to AI Systems",
  },
  {
    title: "Focused tools are still beating broad AI suites",
    description:
      "Users adopt AI faster when the promise is narrow, obvious, and tied to one painful job rather than a bloated platform story.",
    relatedTitle: "Small AI Tools Are Winning",
  },
  {
    title: "The real leap is execution, not assistance",
    description:
      "Teams are paying more attention to systems that complete work end to end than to assistants that only suggest the next step.",
    relatedTitle: "The Rise of AI Agents in Daily Work",
  },
  {
    title: "Invisible AI often feels more premium than visible AI",
    description:
      "When automation disappears into the product surface, the experience feels calmer, faster, and more trustworthy to everyday users.",
    relatedTitle: "Why AI Interfaces Are Disappearing",
  },
  {
    title: "AI literacy is becoming a practical product skill",
    description:
      "Knowing how to think with AI is turning into baseline fluency for operators, writers, builders, and teams that want leverage.",
    relatedTitle: "The New Skill: Working With AI",
  },
];

const getFactIndex = () => {
  const now = new Date();
  const utcStart = Date.UTC(now.getUTCFullYear(), 0, 0);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const dayOfYear = Math.floor((today - utcStart) / 86400000);

  return dayOfYear % FACTS.length;
};

export default function TodaysFactCard({ posts }) {
  const fact = FACTS[getFactIndex()];
  const relatedPost = posts.find((post) => post.title === fact.relatedTitle) || posts[0] || null;

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.24)] backdrop-blur">
      <h2 className="text-xl font-semibold tracking-tight text-white">🧠 today&apos;s fact</h2>
      <h3 className="mt-4 text-base font-medium leading-7 text-white">{fact.title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/55">{fact.description}</p>

      {relatedPost ? (
        <Link
          href={`/post/${relatedPost._id}`}
          className="mt-5 inline-flex text-sm text-white/68 transition hover:text-white"
        >
          read more: {relatedPost.title}
        </Link>
      ) : null}
    </section>
  );
}
