/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Key, ChevronRight, X, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApiKeyNoticeProps {
  hasGroqKey: boolean;
  model: string;
}

export const ApiKeyNotice: React.FC<ApiKeyNoticeProps> = ({ hasGroqKey, model }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  if (isDismissed) return null;

  return (
    <>
      <div className="bg-slate-900 border-b border-slate-800 text-xs text-slate-300 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {hasGroqKey ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-white">Groq API Connected:</strong> Utilizing model{' '}
                  <code className="text-indigo-300 font-mono text-[11px] bg-slate-800 px-1.5 py-0.5 rounded">
                    {model}
                  </code>
                </span>
              </>
            ) : (
              <>
                <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong className="text-amber-300">Curriculum Engine Mode:</strong> Groq API key is not yet set in backend environment. Roadmaps are synthesized with the high-fidelity Adaptive Curriculum Engine.
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!hasGroqKey && (
              <button
                onClick={() => setShowGuide(true)}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 cursor-pointer"
              >
                Groq Setup Guide →
              </button>
            )}
            <button
              onClick={() => setIsDismissed(true)}
              className="text-slate-500 hover:text-slate-300 p-0.5"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Configuring Groq API Key</h3>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                CareerPath AI integrates with Groq for near-instant inference using LLaMA 3.3. To activate live model calls:
              </p>

              <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-1">
                <li>
                  Visit{' '}
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    console.groq.com/keys <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  to create a free Groq API key.
                </li>
                <li>
                  In the root of this project, create or open <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">.env</code>.
                </li>
                <li>
                  Add your key:
                  <pre className="mt-1.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-emerald-400 text-[11px] overflow-x-auto">
                    GROQ_API_KEY="gsk_your_key_here"
                  </pre>
                </li>
                <li>
                  The backend automatically reloads and connects to Groq.
                </li>
              </ol>

              <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 text-slate-400 text-[11px]">
                Note: In the meantime, the application is completely functional out of the box using the Adaptive Curriculum Synthesis Engine!
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowGuide(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-750 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
