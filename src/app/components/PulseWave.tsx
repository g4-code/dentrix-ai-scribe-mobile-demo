import React from 'react';

interface PulseWaveProps {
  size?: number;
}

const PulseWave: React.FC<PulseWaveProps> = ({ size = 300 }) => {
  const scaleFactor = size / 300;

  return (
    <div className="pulse-container">
      <div className="pulse-circle circle1"></div>
      <div className="pulse-circle circle2"></div>
      <div className="pulse-circle circle3"></div>
      <div className="pulse-circle circle4"></div>

      <div className="center-icon">
        <div className="sound-wave">
          {[10, 20, 40, 20, 10].map((height, index) => (
            <span
              key={index}
              style={{
                height: `${height * scaleFactor}px`,
                animationDelay: `${index * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .pulse-container {
          position: relative;
          width: ${size}px;
          height: ${size}px;
          margin: 20px auto;
        }

        .pulse-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          border: ${2 * scaleFactor}px solid rgba(0, 123, 255, 0.1);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 4s infinite ease-out;
        }

        .circle1 {
          width: ${100 * scaleFactor}px;
          height: ${100 * scaleFactor}px;
          animation-delay: 0s;
        }

        .circle2 {
          width: ${140 * scaleFactor}px;
          height: ${140 * scaleFactor}px;
          animation-delay: 0.4s;
        }

        .circle3 {
          width: ${180 * scaleFactor}px;
          height: ${180 * scaleFactor}px;
          animation-delay: 0.8s;
        }

        .circle4 {
          width: ${220 * scaleFactor}px;
          height: ${220 * scaleFactor}px;
          animation-delay: 1.2s;
        }

        @keyframes pulse {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.9);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.3);
          }
        }

        .center-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, #e6f0ff, #d4e6ff);
          border-radius: 50%;
          width: ${120 * scaleFactor}px;
          height: ${120 * scaleFactor}px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 ${20 * scaleFactor}px rgba(0, 123, 255, 0.3);
        }

        .sound-wave {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: ${5 * scaleFactor}px;
        }

        .sound-wave span {
          width: ${6 * scaleFactor}px;
          background-color: #004aad;
          border-radius: ${3 * scaleFactor}px;
          display: inline-block;
          animation: waveAnim 1s infinite ease-in-out;
        }

        @keyframes waveAnim {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.6);
          }
        }
      `}</style>
    </div>
  );
};

export default PulseWave;
