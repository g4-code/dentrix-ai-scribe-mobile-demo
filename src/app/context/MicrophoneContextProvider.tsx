"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";

interface MicrophoneContextType {
  microphone: MediaRecorder | null;
  startMicrophone: () => void;
  stopMicrophone: () => void;
  setupMicrophone: () => void;
  microphoneState: MicrophoneState | null;
}

export enum MicrophoneEvents {
  DataAvailable = "dataavailable",
  Error = "error",
  Pause = "pause",
  Resume = "resume",
  Start = "start",
  Stop = "stop",
}

export enum MicrophoneState {
  NotSetup = -1,
  SettingUp = 0,
  Ready = 1,
  Opening = 2,
  Open = 3,
  Error = 4,
  Pausing = 5,
  Paused = 6,
}

const MicrophoneContext = createContext<MicrophoneContextType | undefined>(
  undefined
);

interface MicrophoneContextProviderProps {
  children: ReactNode;
}

const MicrophoneContextProvider: React.FC<MicrophoneContextProviderProps> = ({
  children,
}) => {
  const [microphoneState, setMicrophoneState] = useState<MicrophoneState>(
    MicrophoneState.NotSetup
  );
  const [microphone, setMicrophone] = useState<MediaRecorder | null>(null);

  const setupMicrophone = useCallback(async () => {
    console.log('Setting up fresh microphone...');
    setMicrophoneState(MicrophoneState.SettingUp);

    try {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
        },
      });

      const microphone = new MediaRecorder(userMedia);

      setMicrophoneState(MicrophoneState.Ready);
      setMicrophone(microphone);
      console.log('Fresh microphone setup complete');
    } catch (err) {
      console.error("Microphone setup error:", err);
      setMicrophoneState(MicrophoneState.Error);
    }
  }, []);

  const stopMicrophone = useCallback(() => {
    console.log('Stopping microphone and releasing browser access...');
    setMicrophoneState(MicrophoneState.Pausing);

    if (microphone?.state === "recording") {
      // Stop the MediaRecorder completely (not pause)
      microphone.stop();
      
      // Stop all tracks in the MediaStream to release microphone access
      const stream = microphone.stream;
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped microphone track:', track.kind);
        });
      }
      
      // Clear the microphone since it's now unusable (tracks are stopped)
      setMicrophone(null);
      setMicrophoneState(MicrophoneState.NotSetup);
      console.log('Microphone fully stopped - browser indicator should disappear');
    }
  }, [microphone]);

  const startMicrophone = useCallback(() => {
    console.log('Starting microphone, current microphone:', microphone?.state);
    
    if (!microphone) {
      // Microphone was completely stopped, need to set up fresh
      console.log('No microphone - setting up fresh one');
      setupMicrophone();
      return;
    }

    setMicrophoneState(MicrophoneState.Opening);

    if (microphone.state === "inactive") {
      console.log('Starting fresh microphone');
      microphone.start(250);
      setMicrophoneState(MicrophoneState.Open);
    } else {
      console.log('Unexpected microphone state:', microphone.state, '- setting up fresh');
      setupMicrophone();
    }
  }, [microphone, setupMicrophone]);

  return (
    <MicrophoneContext.Provider
      value={{
        microphone,
        startMicrophone,
        stopMicrophone,
        setupMicrophone,
        microphoneState,
      }}
    >
      {children}
    </MicrophoneContext.Provider>
  );
};

function useMicrophone(): MicrophoneContextType {
  const context = useContext(MicrophoneContext);

  if (context === undefined) {
    throw new Error(
      "useMicrophone must be used within a MicrophoneContextProvider"
    );
  }

  return context;
}

export { MicrophoneContextProvider, useMicrophone }; 