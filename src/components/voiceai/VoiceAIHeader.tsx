"use client";

import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceAIHeaderProps {
  title: string;
  onClose?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function VoiceAIHeader({ title, onClose, onBack, showBackButton = false }: VoiceAIHeaderProps) {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton && onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="p-2 h-auto hover:bg-gray-100 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
          )}
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h1>
        </div>
        
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="p-2 h-auto hover:bg-gray-100 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-500" />
          </Button>
        )}
      </div>
    </div>
  );
} 