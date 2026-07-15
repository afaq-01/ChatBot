import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Mic, MicOff, Square, ArrowUp } from "lucide-react";

// ---------------------------------------------------------------------------
// COMPOSER
// ---------------------------------------------------------------------------
export function Composer({ onSend, disabled, isStreaming, onStop }) {
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Set up SpeechRecognition once on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return; // browser doesn't support it (e.g. Firefox)

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setValue((prev) => {
        // Replace only the "live" trailing portion, keep whatever was typed before listening started
        const base = recognitionRef.current?.baseValue ?? "";
        return (base ? base + " " : "") + transcript;
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.baseValue = value; // remember what was already typed
      recognition.start();
      setIsListening(true);
    }
  };

  const submit = () => {
    const trimmed = value.trim();
    if ((!trimmed && !file) || disabled) return;
    if (isListening) recognitionRef.current?.stop();
    onSend(trimmed, file);
    setValue("");
    setFile(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      alert("Only image files are supported right now.");
      return;
    }
    if (selected.size > 4 * 1024 * 1024) {
      alert("Please choose an image under 4MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      setFile({ name: selected.name, type: selected.type, base64 });
    };
    reader.readAsDataURL(selected);
    e.target.value = "";
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [value]);

  return (
    <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-[28px] bg-[var(--surface-2)] px-3 sm:px-4 py-2.5 sm:py-3">
          {file && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <img
                src={`data:${file.type};base64,${file.base64}`}
                alt={file.name}
                className="w-10 h-10 rounded-lg object-cover border border-[var(--border)]"
              />
              <span className="text-xs text-[var(--text-muted)] truncate max-w-[160px]">{file.name}</span>
              <button onClick={() => setFile(null)} className="text-xs text-[var(--text-faint)] hover:text-[var(--text-heading)] ml-1">
                Remove
              </button>
            </div>
          )}
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Message Nexora..."}
            className="w-full bg-transparent outline-none resize-none text-[var(--text-body)] placeholder:text-[var(--text-faint)] text-[15px] px-1.5 py-1.5 mb-1"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 sm:gap-1.5 text-[var(--text-muted)] text-xs sm:text-sm">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[var(--surface-1)] transition-colors"
              >
                <Paperclip size={17} strokeWidth={1.75} />
              </button>
              <button
                onClick={toggleListening}
                title={isListening ? "Stop listening" : "Voice input"}
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                  isListening ? "bg-red-500/15 text-red-500" : "hover:bg-[var(--surface-1)]"
                }`}
              >
                {isListening ? <MicOff size={17} strokeWidth={1.75} /> : <Mic size={17} strokeWidth={1.75} />}
              </button>


            </div>
            {isStreaming ? (
              <button onClick={onStop} title="Stop generating" className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center bg-[var(--send-bg)] text-[var(--send-text)] transition-colors">
                <Square size={14} strokeWidth={2} fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!value.trim() && !file}
                className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors ${
                  value.trim() || file ? "bg-[var(--send-bg)] text-[var(--send-text)]" : "bg-[var(--surface-1)] text-[var(--text-faint)]"
                }`}
              >
                <ArrowUp size={18} strokeWidth={2.25} />
              </button>
            )}
          </div>
        </div>
        <p className="text-center text-[11px] text-[var(--text-faint)] mt-3 px-2">
          Nexora can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
}

export default Composer;
