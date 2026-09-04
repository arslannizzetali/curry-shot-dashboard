type AssistToggleProps = {
  assistMode: boolean;
  onToggle: (assistMode: boolean) => void;
};

export function AssistToggle({ assistMode, onToggle }: AssistToggleProps) {
  const label = assistMode ? "Assisted 3PT Makes" : "All 3PT Attempts";

  return (
    <button
      type="button"
      aria-pressed={assistMode}
      onClick={() => onToggle(!assistMode)}
      className={`group flex min-w-[248px] items-center justify-between gap-4 rounded-2xl border p-2 text-left shadow-panel transition duration-200 hover:-translate-y-0.5 ${
        assistMode
          ? "border-warriors-orange/45 bg-warriors-orange/10 hover:border-warriors-orange/70"
          : "border-[#00A3FF]/25 bg-slate-950/70 hover:border-warriors-gold/55"
      }`}
    >
      <span className="px-3">
        <span className="block text-[0.62rem] font-black uppercase tracking-[0.28em] text-slate-400">
          Assist Mode
        </span>
        <span
          className={`mt-1 block text-sm font-black uppercase tracking-tight ${
            assistMode ? "text-warriors-orange" : "text-white"
          }`}
        >
          {label}
        </span>
      </span>

      <span
        className={`relative h-10 w-[4.75rem] rounded-full p-1 transition duration-200 ${
          assistMode
            ? "bg-warriors-orange shadow-[0_0_24px_rgba(249,115,22,0.45)]"
            : "bg-[#00A3FF]/30 shadow-[0_0_24px_rgba(0,163,255,0.25)]"
        }`}
      >
        <span
          className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow-lg transition duration-200 ${
            assistMode ? "translate-x-[2.25rem]" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
