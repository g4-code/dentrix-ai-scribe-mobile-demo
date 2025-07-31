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
          <div className="flex items-center justify-between min-h-[56px]">
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
                <div className="flex items-center justify-center flex-1 py-2">
                  <Image
                    src="/icon_main.svg"
                    alt="Dentrix Ascend AI"
                    width={183} // Scaled for responsive sizing
                    height={96}  // Scaled for responsive sizing
                    className="h-10 sm:h-12 md:h-14 w-auto object-contain" // Responsive sizing: mobile (40px) -> tablet (48px) -> desktop (56px)
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