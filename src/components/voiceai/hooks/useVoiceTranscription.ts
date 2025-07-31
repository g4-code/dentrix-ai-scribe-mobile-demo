"use client";

/* eslint-disable react-hooks/exhaustive-deps */
// Complex audio/WebSocket management hook - adding suggested dependencies could cause infinite re-renders

import { useEffect, useRef, useState, useCallback } from "react";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "../../../app/context/DeepgramContextProvider";
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from "../../../app/context/MicrophoneContextProvider";
import type { ClinicalFinding } from "../types";
import { useClinicalAnalysis } from "./useClinicalAnalysis";

export interface UseVoiceTranscriptionReturn {
  caption: string | undefined;
  isRecording: boolean;
  isConnected: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  microphoneState: MicrophoneState | null;
  connectionState: LiveConnectionState;
  connectionHealth: 'healthy' | 'warning' | 'reconnecting' | 'failed';
  silenceWarning: boolean;
  lastAudioTime: number | null;
  // 🆕 Clinical analysis integration
  detectedFindings: ClinicalFinding[];
  onClinicalFindingDetected?: (finding: ClinicalFinding) => void;
}

export function useVoiceTranscription(
  onClinicalFindingDetected?: (finding: ClinicalFinding) => void
): UseVoiceTranscriptionReturn {
  const [caption, setCaption] = useState<string | undefined>("Ready to record...");
  const [isRecording, setIsRecording] = useState(false);
  const [userWantsToRecord, setUserWantsToRecord] = useState(false);
  
  // Enhanced connection management state
  const [connectionHealth, setConnectionHealth] = useState<'healthy' | 'warning' | 'reconnecting' | 'failed'>('healthy');
  const [silenceWarning, setSilenceWarning] = useState(false);
  const [lastAudioTime, setLastAudioTime] = useState<number | null>(null);
  
  const { connection, connectToDeepgram, disconnectFromDeepgram, connectionState, setConnectionTimeoutCallback } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, stopMicrophone, microphoneState } = useMicrophone();
  
  // 🆕 Clinical analysis integration
  const { analyzeTranscript, detectedFindings, clearFindings } = useClinicalAnalysis();
  const previousFindingsCount = useRef(0);
  
  const captionTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const keepAliveInterval = useRef<NodeJS.Timeout | undefined>(undefined);
  
  // Enhanced connection management refs
  const connectionKeepAliveInterval = useRef<NodeJS.Timeout | undefined>(undefined);
  const reconnectionAttempts = useRef(0);
  const maxReconnectionAttempts = 3;
  const reconnectionTimeouts = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastAudioTimeRef = useRef<number>(Date.now());
  const silenceWarningTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  
  // Track if user has ever initiated recording to prevent unwanted reconnections
  const hasUserInitiatedRecording = useRef(false);
  
  // Track isRecording state in ref to avoid closure issues
  const isRecordingRef = useRef(false);
  
  // Refs to avoid stale closures in callbacks
  const connectToDeepgramRef = useRef(connectToDeepgram);
  const disconnectFromDeepgramRef = useRef(disconnectFromDeepgram);
  
  // Update refs when functions change
  useEffect(() => {
    connectToDeepgramRef.current = connectToDeepgram;
    disconnectFromDeepgramRef.current = disconnectFromDeepgram;
  }, [connectToDeepgram, disconnectFromDeepgram]);
  
  // Update isRecording ref when state changes
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Helper function to clear silence warnings
  const clearSilenceWarning = () => {
    setSilenceWarning(false);
    if (connectionHealth === 'warning') {
      setConnectionHealth('healthy');
    }
    if (silenceWarningTimeout.current) {
      console.log('🧹 Clearing silenceWarningTimeout');
      clearTimeout(silenceWarningTimeout.current);
      silenceWarningTimeout.current = undefined;
    }
  };

  // Enhanced connection management functions
  // Use Deepgram's built-in keepAlive instead of sending invalid audio data
  const startConnectionKeepAlive = () => {
    if (connectionKeepAliveInterval.current) clearInterval(connectionKeepAliveInterval.current);
    
    connectionKeepAliveInterval.current = setInterval(() => {
      if (connection && connectionState === LiveConnectionState.OPEN && isRecordingRef.current) {
        connection.keepAlive();
        console.log("🔇 Sent keepAlive to maintain connection during recording");
      }
    }, 8000); // Every 8 seconds (before 10-second timeout)
  };

  const stopConnectionKeepAlive = () => {
    if (connectionKeepAliveInterval.current) {
      clearInterval(connectionKeepAliveInterval.current);
      connectionKeepAliveInterval.current = undefined;
      console.log("🔇 Stopped connection keepAlive");
    }
  };

  // Automatic reconnection with exponential backoff
  const attemptReconnection = useCallback(async () => {
    if (reconnectionAttempts.current >= maxReconnectionAttempts) {
      console.log("❌ Max reconnection attempts reached");
      setCaption("Connection failed - please refresh the page");
      setConnectionHealth('failed');
      return;
    }

    reconnectionAttempts.current++;
    const backoffDelay = Math.pow(2, reconnectionAttempts.current) * 1000; // Exponential backoff
    
    console.log(`🔄 Attempting reconnection ${reconnectionAttempts.current}/${maxReconnectionAttempts} in ${backoffDelay}ms`);
    setCaption(`Reconnecting... (${reconnectionAttempts.current}/${maxReconnectionAttempts})`);
    setConnectionHealth('reconnecting');

    reconnectionTimeouts.current = setTimeout(async () => {
      try {
        // Disconnect existing connection
        disconnectFromDeepgramRef.current();
        
        // Wait for cleanup
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Reconnect with same options
        connectToDeepgramRef.current({
          model: "nova-2",
          interim_results: true,
          smart_format: true,
          filler_words: true,
          utterance_end_ms: 3000,
        });
        
        console.log("🔄 Reconnection attempt initiated");
      } catch (error) {
        console.error("❌ Reconnection failed:", error);
        // Retry after delay instead of immediate recursion
        setTimeout(() => {
          attemptReconnection();
        }, 1000);
      }
    }, backoffDelay);
  }, []); // Empty dependency array to make it stable

  // Update last audio time when receiving audio
  const updateLastAudioTime = () => {
    const now = Date.now();
    lastAudioTimeRef.current = now;
    setLastAudioTime(now);
    setSilenceWarning(false);
    setConnectionHealth('healthy');
    
    // Clear existing warning timeout
    if (silenceWarningTimeout.current) {
      clearTimeout(silenceWarningTimeout.current);
    }
    
    // Only set silence warning timeout if actively recording
    if (isRecordingRef.current) {
      // Set new warning timeout (7 seconds - before 10-second limit)
      silenceWarningTimeout.current = setTimeout(() => {
        // Double-check we're still recording when timeout fires
        if (isRecordingRef.current) {
          setSilenceWarning(true);
          setConnectionHealth('warning');
          console.log("⚠️ Silence warning - approaching timeout during active recording");
        } else {
          console.log("🔇 Silence timeout fired but not recording - skipping warning");
        }
      }, 7000);
    } else {
      console.log("🔇 Audio received but not recording - skipping silence warning timeout");
    }
  };

  // Don't setup microphone on mount - wait for user to click record button
  // useEffect(() => {
  //   setupMicrophone();
  // }, [setupMicrophone]);

  // Handle microphone errors
  useEffect(() => {
    if (microphoneState === MicrophoneState.Error) {
      setCaption("Microphone access denied - please allow microphone access and refresh");
    }
  }, [microphoneState]);

  // Connect to Deepgram when microphone is ready
  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready && !connection) {
      console.log("🔗 Creating NEW Deepgram connection for fresh microphone session");
      connectToDeepgramRef.current({
        model: "nova-2",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      });
    } else if (microphoneState === MicrophoneState.Ready && connection) {
      console.log("🔄 Microphone ready but connection already exists - reusing connection");
      console.log("🔄 Connection state:", connectionState, "Ready state:", connection?.getReadyState?.());
    }
  }, [microphoneState, connection, connectionState]);

  // Setup Deepgram connection listeners (only when connection opens - not when microphone changes)
  useEffect(() => {
    console.log('🔌 Connection effect triggered - Connection:', !!connection, 'State:', connectionState, 'isRecording:', isRecording);
    
    if (!connection || connectionState !== LiveConnectionState.OPEN) {
      console.log('❌ Connection effect - conditions not met, returning');
      return;
    }

    const onTranscript = (data: LiveTranscriptionEvent) => {
      try {
        const { is_final: isFinal, speech_final: speechFinal } = data;
        const thisCaption = data.channel?.alternatives?.[0]?.transcript || "";

        console.log("📝 RAW thisCaption received:", JSON.stringify(thisCaption));
        console.log("📝 thisCaption length:", thisCaption.length);
        console.log("📝 isFinal:", isFinal, "speechFinal:", speechFinal);
        
        // Update last audio time when we receive any transcript data
        if (thisCaption !== "" || isFinal) {
          updateLastAudioTime();
        }
        
        if (thisCaption !== "") {
          console.log('✅ thisCaption !== "" - SETTING CAPTION:', thisCaption);
          setCaption(thisCaption);
          
          // 🆕 NEW: Clinical analysis integration
          console.log('🔍 Triggering clinical analysis for transcript:', thisCaption.substring(0, 30) + "...");
          analyzeTranscript(thisCaption, Boolean(isFinal && speechFinal));
        } else {
          console.log('⚠️ thisCaption is empty string, not setting caption');
        }

        if (isFinal && speechFinal) {
          console.log('🕒 Setting timeout to clear caption after final transcript');
          if (captionTimeout.current) clearTimeout(captionTimeout.current);
          captionTimeout.current = setTimeout(() => {
            console.log('🕒 Timeout fired - isRecording:', isRecording);
            // Only clear if we're still recording (avoid interfering with state transitions)
            if (isRecordingRef.current) {
              console.log('🕒 Setting caption to "Listening..." from timeout');
              setCaption("Listening...");
            } else {
              console.log('🕒 Not setting "Listening..." because not recording');
            }
            if (captionTimeout.current) clearTimeout(captionTimeout.current);
          }, 3000);
        }
      } catch (error) {
        console.error("❌ Error processing transcript:", error);
      }
    };

    const onError = (error: unknown) => {
      console.error("❌ Deepgram transcription error:", error);
      setCaption("Connection error - please refresh the page");
    };

    console.log('🔌 Setting up Deepgram connection listeners (once per connection)');
    connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
    connection.addListener(LiveTranscriptionEvents.Error, onError);
    console.log('✅ Deepgram listeners set up complete');

    return () => {
      console.log('🧹 Cleaning up Deepgram connection listeners');
      connection?.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      connection?.removeListener(LiveTranscriptionEvents.Error, onError);
      if (captionTimeout.current) clearTimeout(captionTimeout.current);
    };
  }, [connection, connectionState]);

  // Setup microphone data listener (when microphone changes)
  useEffect(() => {
    console.log('🎤 Microphone data effect triggered - Microphone:', !!microphone, 'Connection:', !!connection, 'ConnectionState:', connectionState);
    
    if (!microphone || !connection || connectionState !== LiveConnectionState.OPEN) {
      console.log('❌ Microphone data effect - conditions not met, returning');
      return;
    }

    const onData = (e: BlobEvent) => {
      try {
        if (e.data.size > 0 && connection) {
          console.log("📡 Sending audio data, size:", e.data.size, "Connection alive:", !!connection);
          connection.send(e.data);
        } else {
          console.log("⚠️ Skipping audio data - size:", e.data.size, "connection:", !!connection);
        }
      } catch (error) {
        console.error("❌ Error sending audio data:", error);
      }
    };

    console.log('🎤 Setting up microphone data listener for fresh microphone');
    microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

    return () => {
      console.log('🧹 Cleaning up microphone data listener');
      microphone?.removeEventListener(MicrophoneEvents.DataAvailable, onData);
    };
  }, [microphone, connection, connectionState]);

  // Sync isRecording state with MicrophoneState (like original implementation)
  useEffect(() => {
    console.log('🔄 MicrophoneState changed to:', microphoneState, 'Current isRecording:', isRecording);
    if (microphoneState === MicrophoneState.Open) {
      console.log('✅ Setting recording state to true');
      setIsRecording(true);
      console.log('🚫 NOT setting caption to "Listening..." - letting transcription appear');
      // Don't immediately set "Listening..." - let transcription appear
      // setCaption("Listening..."); // Removed - this overwrites actual transcripts
    } else if (microphoneState === MicrophoneState.Paused) {
      console.log('⏸️ Setting recording state to false (paused)');
      setIsRecording(false);
      setCaption("Recording paused");
      // Clear silence warnings when stopping recording
      clearSilenceWarning();
      // Clear any pending timeouts when stopping
      if (captionTimeout.current) {
        console.log('🧹 Clearing captionTimeout (paused)');
        clearTimeout(captionTimeout.current);
        captionTimeout.current = undefined;
      }
    } else if (microphoneState === MicrophoneState.Ready) {
      console.log('🟢 Setting recording state to false (ready)');
      setIsRecording(false);
      setCaption("Ready to record...");
      // Clear silence warnings when stopping recording
      clearSilenceWarning();
      // Clear any pending timeouts
      if (captionTimeout.current) {
        console.log('🧹 Clearing captionTimeout (ready)');
        clearTimeout(captionTimeout.current);
        captionTimeout.current = undefined;
      }
    } else if (microphoneState === MicrophoneState.NotSetup) {
      console.log('🔴 Setting recording state to false (not setup)');
      setIsRecording(false);
      setCaption("Ready to record...");
      // Clear silence warnings when stopping recording
      clearSilenceWarning();
      // Clear any pending timeouts
      if (captionTimeout.current) {
        console.log('🧹 Clearing captionTimeout (not setup)');
        clearTimeout(captionTimeout.current);
        captionTimeout.current = undefined;
      }
      // Reset user recording flag when microphone goes back to not setup
      hasUserInitiatedRecording.current = false;
      // Disconnect from Deepgram to ensure fresh connection on next attempt
      if (connection) {
        console.log('🔌 Microphone stopped - disconnecting from Deepgram for fresh session');
        disconnectFromDeepgramRef.current();
      }
    }
  }, [microphoneState, connection]); // Removed disconnectFromDeepgramRef.current

  // Auto-start recording when user wants to record and everything is ready
  useEffect(() => {
    if (userWantsToRecord && 
        microphoneState === MicrophoneState.Ready && 
        connectionState === LiveConnectionState.OPEN) {
      console.log('Auto-starting recording - fresh microphone and connection ready');
      setCaption("Starting recording...");
      startMicrophone();
      setUserWantsToRecord(false); // Reset flag
      hasUserInitiatedRecording.current = true; // Mark that user initiated recording
      
      // Clear the "Starting recording..." after a moment to show actual transcription
      setTimeout(() => {
        if (isRecording) {
          setCaption("Listening...");
        }
      }, 1000);
    }
  }, [userWantsToRecord, microphoneState, connectionState, startMicrophone, isRecording]);

  // Keep connection alive when not recording (original Deepgram keepAlive mechanism)
  useEffect(() => {
    if (!connection) return;

    if (microphoneState !== MicrophoneState.Open && connectionState === LiveConnectionState.OPEN) {
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
  }, [microphoneState, connectionState, connection]);

  // Enhanced connection management: Connection keepAlive during recording
  useEffect(() => {
    if (isRecording && connectionState === LiveConnectionState.OPEN) {
      console.log("🔇 Starting connection keepAlive during recording");
      startConnectionKeepAlive();
    } else {
      console.log("🔇 Stopping connection keepAlive during recording");
      stopConnectionKeepAlive();
    }

    return () => {
      stopConnectionKeepAlive();
    };
  }, [isRecording, connectionState]);

  // Enhanced connection management: Reset reconnection attempts on successful connection
  useEffect(() => {
    if (connectionState === LiveConnectionState.OPEN) {
      reconnectionAttempts.current = 0;
      setConnectionHealth('healthy');
      console.log("✅ Connection restored - reset reconnection attempts");
    } else if (connectionState === LiveConnectionState.CLOSED && isRecording && hasUserInitiatedRecording.current) {
      // Only attempt reconnection if we were recording AND user has initiated recording
      console.log("🔄 Connection closed during recording - attempting reconnection");
      // Use setTimeout to avoid setState during render
      setTimeout(() => {
        attemptReconnection();
      }, 0);
    } else if (connectionState === LiveConnectionState.CLOSED) {
      console.log("🔄 Connection closed but no user-initiated recording - skipping reconnection");
    }
  }, [connectionState, isRecording]); // Removed attemptReconnection from dependencies

  // Enhanced connection management: Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup all timeouts and intervals
      if (connectionKeepAliveInterval.current) clearInterval(connectionKeepAliveInterval.current);
      if (reconnectionTimeouts.current) clearTimeout(reconnectionTimeouts.current);
      if (silenceWarningTimeout.current) clearTimeout(silenceWarningTimeout.current);
      console.log("🧹 Enhanced connection management cleanup completed");
    };
  }, []);

  // Enhanced connection management: Register reconnection callback
  useEffect(() => {
    // Use a stable callback that doesn't change on every render
    const stableReconnectionCallback = () => {
      // Only attempt reconnection if user has initiated recording
      if (!hasUserInitiatedRecording.current) {
        console.log("🔄 Connection timeout detected but user hasn't initiated recording - skipping reconnection");
        return;
      }
      
      console.log("🔄 Connection timeout detected during user session - attempting reconnection");
      // Use setTimeout to avoid setState during render
      setTimeout(() => {
        attemptReconnection();
      }, 0);
    };
    
    setConnectionTimeoutCallback(stableReconnectionCallback);
    
    return () => {
      setConnectionTimeoutCallback(null);
    };
  }, [setConnectionTimeoutCallback]); // Only depend on setConnectionTimeoutCallback

  // 🆕 Clinical findings monitoring and callback triggering
  useEffect(() => {
    console.log("🔍 Clinical findings changed - Count:", detectedFindings.length, "Previous:", previousFindingsCount.current);
    
    // Check if we have new findings
    if (detectedFindings.length > previousFindingsCount.current) {
      const newFindings = detectedFindings.slice(previousFindingsCount.current);
      console.log("🔍 New clinical findings detected:", newFindings.length);
      
      // Trigger callback for each new finding
      if (onClinicalFindingDetected) {
        newFindings.forEach(finding => {
          console.log("🔍 Triggering callback for finding:", finding.checklistItemId, "→", finding.detectedValue);
          onClinicalFindingDetected(finding);
        });
      }
    }
    
    // Update the count for next comparison
    previousFindingsCount.current = detectedFindings.length;
  }, [detectedFindings, onClinicalFindingDetected]);

  // 🆕 Clear clinical findings when stopping recording
  useEffect(() => {
    if (microphoneState === MicrophoneState.NotSetup && previousFindingsCount.current > 0) {
      console.log("🔍 Clearing clinical findings - microphone stopped");
      clearFindings();
      previousFindingsCount.current = 0;
    }
  }, [microphoneState, clearFindings]);

  const startRecording = async () => {
    console.log('🎤 startRecording called!');
    console.log('- Connection state:', connectionState, 'Microphone state:', microphoneState);
    console.log('- userWantsToRecord:', userWantsToRecord);
    
    // Mark that user has initiated recording
    hasUserInitiatedRecording.current = true;
    
    // If microphone is not set up, request permission first
    if (microphoneState === MicrophoneState.NotSetup || microphoneState === null) {
      console.log('Requesting microphone permission...');
      setCaption("Requesting microphone permission...");
      setUserWantsToRecord(true); // Remember that user wants to record
      setupMicrophone();
      return; // Wait for microphone to be ready, then the effect will handle the rest
    }
    
    if (connectionState === LiveConnectionState.OPEN) {
      if (microphoneState === MicrophoneState.Ready || microphoneState === MicrophoneState.Paused) {
        console.log('Starting microphone...');
        setCaption("Starting recording...");
        startMicrophone();
      } else if (microphoneState === MicrophoneState.Open) {
        console.log('Already recording');
        setIsRecording(true);
        setCaption("Listening...");
      } else if (microphoneState === MicrophoneState.SettingUp) {
        console.log('Microphone is setting up, please wait...');
        setCaption("Setting up microphone...");
        setUserWantsToRecord(true); // Remember intent while waiting
      } else {
        console.log('Cannot start recording, microphone state:', microphoneState);
        setCaption("Cannot start recording");
      }
    } else if (microphoneState === MicrophoneState.Ready) {
      console.log('Microphone ready, connecting to Deepgram...');
      setCaption("Connecting to speech service...");
      setUserWantsToRecord(true); // Remember intent while connecting
      // Connection will be established by the effect when microphoneState becomes Ready
    } else {
      console.log('Cannot start recording - not connected and microphone not ready');
      setCaption("Connection required");
    }
  };

  const stopRecording = () => {
    console.log('stopRecording called - Microphone state:', microphoneState);
    
    // Clear the user intent flag
    setUserWantsToRecord(false);
    
    if (microphoneState === MicrophoneState.Open) {
      console.log('Stopping microphone...');
      setCaption("Stopping recording...");
      stopMicrophone();
    } else {
      console.log('Not recording, setting ready state');
      setIsRecording(false);
      setCaption("Ready to record...");
    }
  };

  return {
    caption,
    isRecording,
    isConnected: connectionState === LiveConnectionState.OPEN,
    startRecording,
    stopRecording,
    microphoneState,
    connectionState,
    connectionHealth,
    silenceWarning,
    lastAudioTime,
    // 🆕 Clinical analysis integration
    detectedFindings,
    onClinicalFindingDetected,
  };
} 