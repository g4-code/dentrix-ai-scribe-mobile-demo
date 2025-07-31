"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "../context/DeepgramContextProvider";
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from "../context/MicrophoneContextProvider";
import Visualizer from "./Visualizer";

const App = (): React.JSX.Element => {
  const [caption, setCaption] = useState<string | undefined>(
    "Powered by Deepgram"
  );
  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, microphoneState } =
    useMicrophone();
  const captionTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const keepAliveInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    setupMicrophone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (microphoneState === MicrophoneState.Error) {
      setCaption("Microphone access denied - please allow microphone access and refresh");
    }
  }, [microphoneState]);

  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: "nova-3",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState]);

  useEffect(() => {
    if (!microphone) return;
    if (!connection) return;

    const onData = (e: BlobEvent) => {
      try {
        // iOS SAFARI FIX:
        // Prevent packetZero from being sent. If sent at size 0, the connection will close. 
        if (e.data.size > 0 && connection) {
          connection.send(e.data);
        }
      } catch (error) {
        console.error("Error sending audio data:", error);
      }
    };

          const onTranscript = (data: LiveTranscriptionEvent) => {
        try {
          const { is_final: isFinal, speech_final: speechFinal } = data;
          const thisCaption = data.channel?.alternatives?.[0]?.transcript || "";

          console.log("thisCaption", thisCaption);
          if (thisCaption !== "") {
            console.log('thisCaption !== ""', thisCaption);
            setCaption(thisCaption);
          }

                  if (isFinal && speechFinal) {
          if (captionTimeout.current) clearTimeout(captionTimeout.current);
          captionTimeout.current = setTimeout(() => {
            setCaption(undefined);
            if (captionTimeout.current) clearTimeout(captionTimeout.current);
          }, 3000);
        }
        } catch (error) {
          console.error("Error processing transcript:", error);
        }
      };

      const onError = (error: unknown) => {
        console.error("Deepgram transcription error:", error);
        setCaption("Connection error - please refresh the page");
      };

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      connection.addListener(LiveTranscriptionEvents.Error, onError);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

      startMicrophone();
    }

    return () => {
      // prettier-ignore
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      connection.removeListener(LiveTranscriptionEvents.Error, onError);
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      if (captionTimeout.current) clearTimeout(captionTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState]);

  useEffect(() => {
    if (!connection) return;

    if (
      microphoneState !== MicrophoneState.Open &&
      connectionState === LiveConnectionState.OPEN
    ) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      if (keepAliveInterval.current) clearInterval(keepAliveInterval.current);
    }

    return () => {
      if (keepAliveInterval.current) clearInterval(keepAliveInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState, connectionState]);

  return (
    <>
      <div className="flex h-full antialiased">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col flex-auto h-full">
            {/* height 100% minus 8rem */}
            <div className="relative w-full h-full">
              {microphone && <Visualizer microphone={microphone} />}
              <div className="absolute bottom-[8rem] inset-x-0 max-w-4xl mx-auto text-center">
                {caption && <span className="bg-black/70 p-8 text-white rounded">{caption}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App; 