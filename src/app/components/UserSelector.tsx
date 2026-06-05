import { TEAM_MEMBERS, TeamMember } from "../types";

type UserSelectorProps = {
  onSelect: (userId: string) => void;
};

export function UserSelector({ onSelect }: UserSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-xl p-8 max-w-md w-full border border-zinc-800 shadow-2xl">
        <h2 className="mb-6 text-center">Welcome to Polarin Ops</h2>
        <p className="text-zinc-400 text-center mb-8">Who are you?</p>
        <div className="space-y-3">
          {TEAM_MEMBERS.map((member) => (
            <button
              key={member.id}
              onClick={() => onSelect(member.id)}
              className="w-full flex items-center gap-4 p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-all hover:border-blue-500/50"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white">{member.initials}</span>
              </div>
              <span className="text-zinc-100">{member.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
