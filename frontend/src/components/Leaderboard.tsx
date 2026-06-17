"use client";

interface LeaderboardEntry {
  address: string;
  reputation: number;
  submissions: number;
  correct_submissions: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <span className="text-accent font-bold">&#9733; I</span>;
      case 1:
        return <span className="text-accent font-bold">&#9733; II</span>;
      case 2:
        return <span className="text-accent font-bold">&#9733; III</span>;
      default:
        return <span className="text-muted">{index + 1}</span>;
    }
  };

  return (
    <section id="leaderboard" className="py-12 px-4 bg-white border-y border-border">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-8">
          <span className="text-xs font-serif tracking-widest text-muted uppercase">
            Hall of Fame
          </span>
          <h2 className="headline-lg mt-2">Top Fact-Checkers</h2>
          <div className="rule-thin mt-4 max-w-xs mx-auto"></div>
        </div>

        {/* Leaderboard table */}
        <div className="article-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border bg-highlight">
                <th className="py-3 px-4 text-left font-serif text-sm uppercase tracking-wider">
                  Rank
                </th>
                <th className="py-3 px-4 text-left font-serif text-sm uppercase tracking-wider">
                  Address
                </th>
                <th className="py-3 px-4 text-center font-serif text-sm uppercase tracking-wider">
                  Reputation
                </th>
                <th className="py-3 px-4 text-center font-serif text-sm uppercase tracking-wider">
                  Submissions
                </th>
                <th className="py-3 px-4 text-center font-serif text-sm uppercase tracking-wider">
                  Accuracy
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted font-body">
                    No fact-checkers yet. Be the first!
                  </td>
                </tr>
              ) : (
                entries.map((entry, index) => (
                  <tr
                    key={entry.address}
                    className={`border-b border-border hover:bg-highlight transition-colors ${
                      index < 3 ? "bg-highlight/50" : ""
                    }`}
                  >
                    <td className="py-4 px-4 font-serif text-lg">
                      {getRankBadge(index)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm">{formatAddress(entry.address)}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-serif text-lg font-bold text-accent">
                        {entry.reputation}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-body">
                      {entry.submissions}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {entry.submissions > 0 ? (
                        <span className="font-body">
                          {Math.round((entry.correct_submissions / entry.submissions) * 100)}%
                        </span>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
