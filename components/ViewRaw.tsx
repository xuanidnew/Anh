import React, { useState, useEffect } from 'react';
import { Icons, DISCORD_LINK } from '../constants';
import { RawPayload } from '../types';
import { isRobloxEnvironment } from '../utils/crypto';

interface ViewRawProps {
  payload: RawPayload;
}

const ViewRaw: React.FC<ViewRawProps> = ({ payload }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  
  // Dev mode bypass toggle for testing
  const [simulatedRobloxEnv, setSimulatedRobloxEnv] = useState(false);

  useEffect(() => {
    // 1. Check for Roblox Environment (Real UA check)
    // If running in game script context, unlock immediately
    if (isRobloxEnvironment()) {
      setIsAuthenticated(true);
      return;
    }

    // 2. Simulated Check (For demo/testing purposes)
    if (simulatedRobloxEnv) {
        setIsAuthenticated(true);
        return;
    }

    // 3. If password is NOT set, we can allow access, 
    // BUT the user requested "hide link when open in normal browser".
    // So we generally default to locked unless it's environment detected or password entered.
    // If no password was set at creation, we might default to open, 
    // strictly following the prompt: "Only ask pass if user tries to copy raw link into browser"
    if (!payload.password) {
        setIsAuthenticated(true);
    }

  }, [payload.password, simulatedRobloxEnv]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === payload.password) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Access Denied: Invalid Password');
      setPasswordInput('');
    }
  };

  // Prevent right click and inspect if not authenticated to prevent "Spying"
  useEffect(() => {
    if (isAuthenticated) return;

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthenticated]);

  // LOCKED STATE
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-900 border border-red-800 rounded-lg p-8 shadow-[0_0_50px_rgba(220,38,38,0.2)] text-center space-y-6">
          
          <div className="flex justify-center mb-4">
             <div className="p-4 bg-red-950/50 rounded-full border border-red-600/30 animate-pulse">
                <Icons.Lock className="w-12 h-12 text-red-500" />
             </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Restricted Access</h1>
            <p className="text-red-400 font-mono text-sm">
              ERROR: UNAUTHORIZED ENVIRONMENT DETECTED
            </p>
            <p className="text-gray-400 text-sm mt-4">
              This raw content is protected. Only the file admin can view the source code in a browser.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4 pt-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter Admin Password..."
              className="w-full bg-black border border-gray-700 text-white p-3 rounded text-center focus:border-red-500 focus:outline-none transition-colors"
              autoFocus
            />

            {error && (
              <div className="text-red-500 text-xs font-bold uppercase tracking-wide">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 rounded transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              UNLOCK RAW
            </button>
          </form>

          <div className="pt-6 border-t border-gray-800">
            <a 
              href={DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-gray-500 hover:text-indigo-400 transition-colors text-sm"
            >
              <Icons.Shield className="w-4 h-4" />
              <span>Contact Support (Discord)</span>
            </a>
          </div>
          
          {/* Debug for User Testing */}
          <button 
             onClick={() => setSimulatedRobloxEnv(true)}
             className="mt-4 text-[10px] text-gray-800 hover:text-gray-600"
          >
             [ Simulate Roblox User-Agent ]
          </button>
        </div>
      </div>
    );
  }

  // UNLOCKED / RAW STATE
  // Render as pure text on black background to simulate a raw text file
  return (
    <div className="min-h-screen w-full bg-[#0d1117] text-[#c9d1d9] font-mono text-sm p-4 relative">
        <style>{`
          body { background-color: #0d1117; margin: 0; }
          ::selection { background-color: #58a6ff; color: #0d1117; }
        `}</style>

        {/* Floating Controls (Subtle) */}
        <div className="fixed top-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
             <div className="bg-gray-800 px-3 py-1 rounded text-xs text-gray-400 border border-gray-700">
                {simulatedRobloxEnv || isRobloxEnvironment() ? 'Environment: Roblox' : 'Environment: Admin'}
             </div>
             <button 
                onClick={() => navigator.clipboard.writeText(payload.code)}
                className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 border border-gray-700"
                title="Copy All"
             >
                <Icons.Copy className="w-4 h-4" />
             </button>
        </div>

        {/* The Raw Code */}
        <pre className="whitespace-pre-wrap break-words max-w-full font-mono outline-none">
            {payload.code}
        </pre>
    </div>
  );
};

export default ViewRaw;