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
    <section className="rounded-xl border border-stone-200 bg-stone-50 p-3.5 dark:border-stone-800 dark:bg-[linear-gradient(180deg,rgba(34,30,27,0.98),rgba(24,21,19,0.98))] dark:ring-1 dark:ring-inset dark:ring-stone-800/80 sm:p-4">
      <h2 className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100 sm:text-xl">🧠 today&apos;s fact</h2>
      <h3 className="mt-3 text-sm font-medium leading-relaxed text-stone-900 dark:text-stone-100 sm:mt-4 sm:text-base">{fact.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-stone-600 dark:text-stone-400 sm:mt-3">{fact.description}</p>

      {relatedPost ? (
        <Link
          href={`/post/${relatedPost._id}`}
          className="mt-4 inline-flex text-sm text-stone-600 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-white sm:mt-5"
        >
          read more: {relatedPost.title}
        </Link>
      ) : null}
    </section>
  );
}
