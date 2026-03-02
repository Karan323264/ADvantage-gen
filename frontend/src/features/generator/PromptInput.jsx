import { useEffect, useRef } from "react";
import { Send } from "lucide-react";

function PromptInput({
  value = "",
  onChange = () => {},
  onSend = () => {},
  readOnly = false,
  loading = false,
  highlightSend = false,
}) {
  const textareaRef = useRef(null);

  // Auto resize
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);

  return (
    <div className="relative w-full">
      <div
        className="
          bg-white
          border border-slate-200
          rounded-2xl
          px-6 py-5
          shadow-sm
          transition
          focus-within:border-slate-400
        "
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          rows={1}
          placeholder="Describe your campaign idea..."
          className="
            w-full
            bg-transparent
            text-slate-900
            placeholder-slate-400
            resize-none
            focus:outline-none
            text-lg
            leading-relaxed
            overflow-hidden
          "
        />

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Press Enter to generate
          </span>

          <button
            onClick={onSend}
            disabled={loading}
            className={`
              h-9 w-9 flex items-center justify-center rounded-lg transition
              ${
                highlightSend
                  ? "bg-slate-900 text-white animate-pulse"
                  : "bg-slate-900 text-white hover:bg-slate-700"
              }
              ${loading ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PromptInput;