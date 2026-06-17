"use client";

export default function HowItWorks() {
  const steps = [
    {
      number: "I",
      title: "Submit a Claim",
      description:
        'Anyone can submit a claim for fact-checking. Provide the statement and optionally a source URL. A small stake of 1 $GEN is required to prevent spam.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      number: "II",
      title: "AI Analysis",
      description:
        "The Intelligent Contract automatically crawls multiple sources, gathering evidence. An LLM analyzes the claim against the evidence and produces a verdict with confidence score.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      number: "III",
      title: "Validator Consensus",
      description:
        "Multiple AI validators independently verify the analysis using Optimistic Democracy. They cross-check sources and reach consensus on the final verdict.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      number: "IV",
      title: "Permanent Record",
      description:
        "The final verdict is stored on-chain permanently. Transparent, immutable, and accessible to anyone. Build reputation through accurate submissions.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-xs font-serif tracking-widest text-muted uppercase">
            The Process
          </span>
          <h2 className="headline-lg mt-2">How It Works</h2>
          <div className="rule-thin mt-4 max-w-xs mx-auto"></div>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-border" />
              )}

              <div className="article-card p-6 text-center relative z-10 bg-paper">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-border bg-white mb-4">
                  <span className="font-serif text-2xl font-bold">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="flex justify-center text-accent mb-4">{step.icon}</div>

                {/* Title */}
                <h3 className="font-serif text-xl font-bold mb-3">{step.title}</h3>

                {/* Description */}
                <p className="text-sm text-muted font-body leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Architecture diagram */}
        <div className="mt-16 article-card p-8">
          <h3 className="headline-md text-center mb-8">System Architecture</h3>
          <div className="font-mono text-sm bg-ink text-paper p-6 overflow-x-auto">
            <pre className="whitespace-pre">
{`┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│  • Submit Claim Form                                │
│  • Verdict Explorer                                 │
│  • Leaderboard                                      │
└───────────────────────┬─────────────────────────────┘
                        │ MetaMask Transaction
┌───────────────────────▼─────────────────────────────┐
│              GENLAYER CONTRACT                       │
│                                                      │
│  factCheck(claim, sources[])                        │
│  ├── get_webpage() × N sources                     │
│  ├── exec_prompt() → AI Analysis                   │
│  └── store verdict on-chain                        │
└───────────────────────┬─────────────────────────────┘
                        │ Optimistic Democracy
┌───────────────────────▼─────────────────────────────┐
│              VALIDATOR NETWORK                       │
│  Node 1 ──┐                                         │
│  Node 2 ──┼──► Consensus → Final TX                │
│  Node 3 ──┘                                         │
└─────────────────────────────────────────────────────┘`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
