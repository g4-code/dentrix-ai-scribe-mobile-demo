"use client";

import { useState } from "react";
import { VoiceAIWorkflow } from "@/components/VoiceAIWorkflow";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}
      
      {!isLoading && (
        <div className="min-h-screen bg-gray-50">
          <VoiceAIWorkflow />
        </div>
      )}
    </>
  );
}
