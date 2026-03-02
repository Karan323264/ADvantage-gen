import { useState } from "react";
import { Briefcase, Sparkles, AlertTriangle, Lightbulb } from "lucide-react";
function ToneSelector({ value, onChange }) {
  const tones = [
    { name: "Professional", icon: Briefcase },
    { name: "Witty", icon: Sparkles },
    { name: "Urgent", icon: AlertTriangle },
    { name: "Inspirational", icon: Lightbulb },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tones.map((tone) => {
        const isActive = value === tone.name;
        const Icon = tone.icon;

        return (
          <button
            key={tone.name}
            onClick={() => onChange(tone.name)}
            className={`
              flex items-center gap-2
              px-4 py-2
              rounded-full
              text-xs font-medium
              transition-all duration-200
              ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
              }
            `}
          >
            <span className={isActive ? "" : "text-slate-400"}>
              <Icon size={14} />
            </span>
            {tone.name}
          </button>
        );
      })}
    </div>
  );
}

export default ToneSelector;