"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface VoiceAIHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  showIcon?: boolean;
}

export function VoiceAIHeader({ title, onBack, showBackButton = false, showIcon = false }: VoiceAIHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      {/* Safe area top inset for devices with notches */}
      <div className="safe-area-inset-top">
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between h-[56px]">
            <div className="flex items-center gap-3 sm:gap-4 flex-1">
              {showBackButton && onBack && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBack}
                  className="
                    shrink-0 
                    p-3 
                    h-auto 
                    hover:bg-gray-100 
                    active:bg-gray-200 
                    rounded-full 
                    min-w-[48px] 
                    min-h-[48px] 
                    w-12 
                    h-12
                    flex 
                    items-center 
                    justify-center
                    touch-manipulation
                    transition-all
                    duration-150
                    focus:ring-2
                    focus:ring-blue-500
                    focus:ring-offset-2
                    -ml-1
                  "
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Button>
              )}
              
              {showIcon ? (
                <div className="flex items-center justify-center flex-1 h-[56px]">
                  <Image
                    src="/icon_main.svg"
                    alt="Dentrix Ascend AI"
                    width={244} // Original SVG width for crisp rendering
                    height={128} // Original SVG height for crisp rendering
                    className="max-h-[48px] sm:max-h-[52px] md:max-h-[52px] w-auto object-contain" // Constrained to fit header height
                    priority
                  />
                </div>
              ) : (
                <h1 className="
                  text-lg 
                  sm:text-xl 
                  md:text-2xl 
                  font-semibold 
                  text-gray-900 
                  leading-tight
                  truncate
                  min-w-0
                  flex-1
                  py-2
                ">
                  {title}
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 