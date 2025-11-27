import React, { useState } from 'react';
import { Icons } from '../constants';
import { RawPayload } from '../types';
import { encodePayload } from '../utils/crypto';

interface CreateRawProps {
  onLinkCreated: (link: string) => void;
}

const CreateRaw: React.FC<CreateRawProps> = ({ onLinkCreated }) => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiInfo, setShowApiInfo] = useState(false);

  const handleCreate = () => {
    if (!code.trim()) return;

    setIsGenerating(true);

    // Simulate "Encryption" delay
    setTimeout(() => {
      try {
        const payload: RawPayload = {
          code,
          password: password.trim() || undefined,
          timestamp: Date.now(),
        };

        const hash = encodePayload(payload);
        
        if (!hash) {
          throw new Error("Encryption failed");
        }
        
        // Use clean URL structure (handled by vercel.json rewrite)
        // From: /api/raw?data=HASH
        // To:   /api/raw/HASH
        const origin = window.location.origin || window.location.href.split('?')[0].replace(/\/$/, '');
        const apiLink = `${origin}/api/raw/${hash}`;
        
        onLinkCreated(apiLink);
      } catch (error) {
        console.error(error);
        alert("Failed to generate link. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
            <Icons.Code className="w-5 h-5 text-indigo-400" />
            Paste Script
          </h2>
          <button 
             type="button"
             onClick={() => setShowApiInfo(!showApiInfo)}
             className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1"
          >
             <Icons.Alert className="w-3 h-3" />
             INFO
          </button>
        </div>

        {showApiInfo && (
           <div className="bg-indigo-900/20 p-4 border-b border-indigo-500/20 text-sm text-indigo-200">
              <p className="font-bold mb-1">Architecture</p>
              <ul className="list-disc list-inside space-y-1 opacity-80 text-xs">
                <li>Link format: <code>/api/raw/[CODE]</code></li>
                <li><strong>Roblox:</strong> API returns Raw Text directly.</li>
                <li><strong>Browser:</strong> API redirects to Login Screen.</li>
                <li>Source maps are disabled in production.</li>
              </ul>
           </div>
        )}
        
        <div className="p-6 space-y-6">
          {/* Code Input */}
          <div className="space-y-2">
            <div className="relative group">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="-- Paste your script here..."
                className="w-full h-64 bg-gray-950 text-gray-300 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-y scrollbar-thin"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Icons.Lock className="w-5 h-5 text-red-500" />
              <h3 className="text-md font-medium text-gray-200">Security Configuration</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Access Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Require password for browser view..."
                    className="w-full bg-gray-900 text-gray-200 pl-10 pr-4 py-2 rounded-md border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm"
                  />
                </div>
              </div>
              
              <div className="flex flex-col justify-end">
                 <div className="p-3 rounded bg-green-900/10 border border-green-500/20 text-xs text-green-400">
                    <p className="flex items-start gap-2">
                      <Icons.Terminal className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        Generated API link is <strong>Roblox Optimized</strong>. Browsers are blocked/redirected automatically.
                      </span>
                    </p>
                 </div>
              </div>
            </div>
          </div>

          {/* Action */}
          <button
            type="button"
            onClick={handleCreate}
            disabled={!code.trim() || isGenerating}
            className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5
              ${!code.trim() 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-indigo-900/50'
              }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Encrypting...
              </>
            ) : (
              <>
                <Icons.Terminal className="w-5 h-5" />
                Create API Link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRaw;