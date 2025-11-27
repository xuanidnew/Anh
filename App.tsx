import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CreateRaw from './components/CreateRaw';
import ViewRaw from './components/ViewRaw';
import { RawPayload, ViewMode } from './types';
import { getPayloadFromUrl } from './utils/crypto';
import { Icons, DISCORD_LINK } from './constants';

function App() {
  const [mode, setMode] = useState<ViewMode>(ViewMode.CREATE);
  const [payload, setPayload] = useState<RawPayload | null>(null);
  const [generatedLink, setGeneratedLink] = useState('');

  // Handle URL changes (Query Params OR Hash)
  useEffect(() => {
    const checkUrl = () => {
      const data = getPayloadFromUrl();
      if (data) {
        setPayload(data);
        setMode(ViewMode.VIEW);
      } else {
        setMode(ViewMode.CREATE);
        setPayload(null);
      }
    };

    // Initial check
    checkUrl();

    // Listen for changes
    window.addEventListener('popstate', checkUrl);
    window.addEventListener('hashchange', checkUrl);
    return () => {
      window.removeEventListener('popstate', checkUrl);
      window.removeEventListener('hashchange', checkUrl);
    };
  }, []);

  const handleLinkCreated = (link: string) => {
    setGeneratedLink(link);
  };

  const resetApp = () => {
    // Clear URL params without refreshing
    window.history.pushState({}, '', window.location.pathname);
    setMode(ViewMode.CREATE);
    setPayload(null);
    setGeneratedLink('');
  };

  // If viewing raw, we render ONLY the ViewRaw component
  if (mode === ViewMode.VIEW && payload) {
    return <ViewRaw payload={payload} />;
  }

  return (
    <div className="min-h-screen bg-[url('https://picsum.photos/1920/1080?blur=10&grayscale')] bg-cover bg-fixed bg-no-repeat bg-gray-950">
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-gray-950/90 pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header onReset={resetApp} />

        <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6">
          
          {/* Create Mode */}
          {mode === ViewMode.CREATE && !generatedLink && (
            <div className="w-full">
              <div className="text-center mb-10 space-y-2">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  Secure <span className="text-indigo-500">Raw</span> Hosting
                </h1>
                <p className="text-gray-400 max-w-lg mx-auto">
                  Upload script to generate a secure raw link.
                  <br />
                  <span className="text-indigo-400 font-bold">Browser</span> = Password Locked
                  <br />
                  <span className="text-emerald-400 font-bold">Roblox</span> = Auto Raw (Requires API)
                </p>
              </div>
              <CreateRaw onLinkCreated={handleLinkCreated} />
            </div>
          )}

          {/* Success State (Link Generated) */}
          {mode === ViewMode.CREATE && generatedLink && (
             <div className="w-full max-w-2xl bg-gray-900 border border-green-500/30 rounded-xl p-8 shadow-2xl text-center space-y-6">
                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto border border-green-500/50">
                   <Icons.Shield className="w-8 h-8 text-green-400" />
                </div>
                <div>
                   <h2 className="text-2xl font-bold text-white">Raw Link Created</h2>
                   <p className="text-gray-400 text-sm mt-2">
                     Use this link with <code>loadstring(game:HttpGet(...))</code>
                   </p>
                </div>
                
                <div className="bg-gray-950 p-4 rounded border border-gray-800 flex items-center gap-3">
                   <input 
                      readOnly 
                      value={generatedLink}
                      className="bg-transparent w-full text-gray-300 text-sm outline-none font-mono truncate"
                   />
                   <button 
                      onClick={() => navigator.clipboard.writeText(generatedLink)}
                      className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white transition-colors"
                   >
                      <Icons.Copy className="w-4 h-4" />
                   </button>
                </div>

                <div className="pt-4 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                        onClick={() => window.open(generatedLink, '_blank')}
                        className="px-4 py-2 rounded border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm"
                    >
                        Test in Browser
                    </button>
                    <button 
                        onClick={resetApp}
                        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 transition-colors text-sm"
                    >
                        Create Another
                    </button>
                </div>
             </div>
          )}
        </main>

        <footer className="py-6 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} SecureRaw. All rights reserved.</p>
          <a href={DISCORD_LINK} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors mt-2 inline-block">
             Join Discord
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;