"use client";

interface Stats {
  total_claims: number;
  total_challenges: number;
  total_staked: number;
  verified_claims: number;
}

interface StatsSectionProps {
  stats: Stats | null;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const statItems = [
    {
      label: "Claims Submitted",
      value: stats?.total_claims ?? 0,
      description: "Total claims submitted for verification",
    },
    {
      label: "Verified Claims",
      value: stats?.verified_claims ?? 0,
      description: "Claims with definitive verdicts",
    },
    {
      label: "Total Challenges",
      value: stats?.total_challenges ?? 0,
      description: "Verdicts challenged by the community",
    },
    {
      label: "Total Staked",
      value: `${stats?.total_staked ?? 0} $GEN`,
      description: "Tokens locked in the protocol",
    },
  ];

  return (
    <section id="stats" className="py-12 px-4 bg-white border-y border-border">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-xs font-serif tracking-widest text-muted uppercase">
            Protocol Metrics
          </span>
          <h2 className="headline-lg mt-2">Live Statistics</h2>
          <div className="rule-thin mt-4 max-w-xs mx-auto"></div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, index) => (
            <div key={index} className="article-card p-6 text-center">
              <div className="text-4xl font-serif font-bold text-accent mb-2">
                {item.value}
              </div>
              <div className="font-serif text-lg font-semibold mb-1">{item.label}</div>
              <div className="text-xs text-muted font-body">{item.description}</div>
            </div>
          ))}
        </div>

        {/* Tokenomics table */}
        <div className="mt-12 article-card overflow-hidden">
          <div className="bg-ink text-paper py-3 px-6">
            <h3 className="font-serif text-lg font-bold">Tokenomics</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-highlight">
                <th className="py-3 px-6 text-left font-serif text-sm uppercase tracking-wider">
                  Action
                </th>
                <th className="py-3 px-6 text-left font-serif text-sm uppercase tracking-wider">
                  Token Flow
                </th>
                <th className="py-3 px-6 text-left font-serif text-sm uppercase tracking-wider">
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3 px-6 font-body">Submit Claim</td>
                <td className="py-3 px-6 font-mono text-sm">User pays 1 $GEN</td>
                <td className="py-3 px-6 font-body">Fee locked in contract</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-6 font-body">Valid Submission</td>
                <td className="py-3 px-6 font-mono text-sm">Partial refund</td>
                <td className="py-3 px-6 font-body">Stake returned + reputation</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-6 font-body">Challenge Verdict</td>
                <td className="py-3 px-6 font-mono text-sm">Challenger pays 5 $GEN</td>
                <td className="py-3 px-6 font-body">Stake locked for review</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-6 font-body">Successful Challenge</td>
                <td className="py-3 px-6 font-mono text-sm">Reward 2x stake</td>
                <td className="py-3 px-6 font-body">Challenger earns tokens</td>
              </tr>
              <tr>
                <td className="py-3 px-6 font-body">Failed Challenge</td>
                <td className="py-3 px-6 font-mono text-sm">Stake slashed</td>
                <td className="py-3 px-6 font-body">Tokens burned</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
