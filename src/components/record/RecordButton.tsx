import { Mic, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function RecordButton() {
  const [recording, setRecording] = useState(false);

  const toggleRecording = () => {
    setRecording((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-32 h-32">
        {/* Ondas animadas */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            animate={
              recording
                ? {
                    scale: [1, 2.8],
                    opacity: [0.7, 0],
                    borderWidth: [8, 2], // Grosor que disminuye
                  }
                : { scale: 1, opacity: 0, borderWidth: 8 }
            }
            transition={{
              duration: 2,
              ease: "easeOut",
              repeat: recording ? Infinity : 0,
              delay: i * 0.4,
            }}
            style={{
              borderStyle: "solid",
              borderColor: "#60A5FA", // azul-400
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Botón principal */}
        <button
          onClick={toggleRecording}
          className={`w-full h-full rounded-full flex items-center justify-center z-10 relative
            ${recording ? "bg-blue-800" : "bg-blue-600"} 
            transition-colors duration-300 shadow-2xl`}
        >
          {recording ? (
            <Pause className="text-white w-8 h-8" />
          ) : (
            <Mic className="text-white w-8 h-8" />
          )}
        </button>
      </div>
    </div>
  );
}
