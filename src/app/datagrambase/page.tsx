"use client";

import "./datagrambase.css";
import App from "../components/App";
import { XIcon } from "../components/icons/XIcon";
import { LinkedInIcon } from "../components/icons/LinkedInIcon";
import { FacebookIcon } from "../components/icons/FacebookIcon";

export default function Home() {
  return (
    <div className="h-full overflow-hidden bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-black/50 to-black/10 backdrop-blur-[2px] h-[4rem] flex items-center">
        <header className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">
              Deepgram Live Transcription
            </h1>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://console.deepgram.com/signup?jump=keys"
              target="_blank"
              className="bg-gradient-to-r from-green-400 to-blue-500 text-black rounded px-4 py-2 font-semibold hover:opacity-90"
            >
              Get API Key
            </a>
          </div>
        </header>
      </div>

      {/* Main App */}
      <main className="h-[calc(100%-8rem)]">
        <App />
      </main>

      {/* Footer */}
      <div className="bg-black/80 h-[4rem] flex items-center">
        <footer className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 flex items-center justify-center gap-4">
          <span className="text-base text-gray-400">Share it:</span>
          <a href="#" className="text-gray-400 hover:text-white">
            <XIcon className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <LinkedInIcon className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <FacebookIcon className="w-5 h-5" />
          </a>
        </footer>
      </div>
    </div>
  );
}