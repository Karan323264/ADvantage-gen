import { useState } from "react";
import { Instagram, Linkedin } from "lucide-react";
function PlatformSelector({ value, onChange }) {
  const platforms = [
    { name: "Instagram", icon: Instagram },
    { name: "LinkedIn", icon: Linkedin },
  ];

  const toggle = (platform) => {
    if (value.includes(platform)) {
      onChange(value.filter((p) => p !== platform));
    } else {
      onChange([...value, platform]);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {platforms.map((platform) => {
        const isActive = value.includes(platform.name);
        const Icon = platform.icon;

        return (
          <button
            key={platform.name}
            onClick={() => toggle(platform.name)}
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
            {platform.name}
          </button>
        );
      })}
    </div>
  );
}

export default PlatformSelector;