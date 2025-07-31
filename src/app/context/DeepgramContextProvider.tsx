"use client";

import {
  createClient,
  LiveClient,
  LiveConnectionState,
  LiveTranscriptionEvents,
  type LiveSchema,
  type LiveTranscriptionEvent,
} from "@deepgram/sdk";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FunctionComponent,
} from "react";

interface DeepgramContextType {
  connection: LiveClient | null;
  connectToDeepgram: (options: LiveSchema, endpoint?: string) => Promise<void>;
  disconnectFromDeepgram: () => void;
  connectionState: LiveConnectionState;
  setConnectionTimeoutCallback: (callback: (() => void) | null) => void;
}

const DeepgramContext = createContext<DeepgramContextType | undefined>(
  undefined
);

interface DeepgramContextProviderProps {
  children: ReactNode;
}

const getToken = async (): Promise<string> => {
  const response = await fetch("/api/authenticate", { cache: "no-store" });
  const result = await response.json();
  
  // Handle both development and production response formats
  return result.access_token || result.key || "";
};

const DeepgramContextProvider: FunctionComponent<
  DeepgramContextProviderProps
> = ({ children }) => {
  const [connection, setConnection] = useState<LiveClient | null>(null);
  const [connectionState, setConnectionState] = useState<LiveConnectionState>(
    LiveConnectionState.CLOSED
  );
  const [connectionTimeoutCallback, setConnectionTimeoutCallback] = useState<(() => void) | null>(null);

  const connectToDeepgram = async (options: LiveSchema, endpoint?: string) => {
    try {
      console.log("🔗 connectToDeepgram called with options:", options);
      const token = await getToken();
      console.log("🔑 Token received:", token ? `${token.substring(0, 8)}...` : "null");
      
      // For raw API keys (development), pass directly; for temporary tokens (production), use accessToken
      const isRawApiKey = !token.startsWith('sk-') && token.length <= 50;
      console.log("🔑 Using raw API key:", isRawApiKey);
      
      const deepgram = isRawApiKey
        ? createClient(token)                    // Raw API key as first parameter
        : createClient({ accessToken: token }); // Temporary token in options

      console.log("🔗 Creating new Deepgram live connection...");
      const conn = deepgram.listen.live(options, endpoint);

      conn.addListener(LiveTranscriptionEvents.Open, () => {
        console.log("🟢 Deepgram WebSocket connection opened successfully");
        console.log("🟢 Connection ready for audio data");
        setConnectionState(LiveConnectionState.OPEN);
      });

      conn.addListener(LiveTranscriptionEvents.Close, (event) => {
        console.log("🔴 Deepgram WebSocket connection closed", event);
        console.log("🔴 Close event details:", {
          code: event?.code,
          reason: event?.reason,
          wasClean: event?.wasClean
        });
        
        const closeCode = event?.code;
        const closeReason = event?.reason;
        
        // Handle specific close codes
        if (closeCode === 1011 && closeReason?.includes("NET-0001")) {
          console.log("🔴 NET-0001: No audio received for 10 seconds - triggering reconnection callback");
          if (connectionTimeoutCallback) {
            connectionTimeoutCallback();
          }
        } else if (closeCode === 1008 && closeReason?.includes("DATA-0000")) {
          console.log("🔴 DATA-0000: Invalid audio data detected");
          // Handle audio data issues - could trigger error callback in the future
        } else if (closeCode === 1011 && closeReason?.includes("NET-0000")) {
          console.log("🔴 NET-0000: Internal server error - may need retry");
          if (connectionTimeoutCallback) {
            connectionTimeoutCallback();
          }
        }
        
        setConnectionState(LiveConnectionState.CLOSED);
      });

      conn.addListener(LiveTranscriptionEvents.Error, (error) => {
        console.error("Deepgram connection error:", error);
        setConnectionState(LiveConnectionState.CLOSED);
      });

      console.log("🔗 Setting new connection in state");
      setConnection(conn);
    } catch (error) {
      console.error("❌ Failed to connect to Deepgram:", error);
      setConnectionState(LiveConnectionState.CLOSED);
    }
  };

  const disconnectFromDeepgram = async () => {
    if (connection) {
      connection.finish();
      setConnection(null);
    }
  };

  return (
    <DeepgramContext.Provider
      value={{
        connection,
        connectToDeepgram,
        disconnectFromDeepgram,
        connectionState,
        setConnectionTimeoutCallback,
      }}
    >
      {children}
    </DeepgramContext.Provider>
  );
};

function useDeepgram(): DeepgramContextType {
  const context = useContext(DeepgramContext);
  if (context === undefined) {
    throw new Error(
      "useDeepgram must be used within a DeepgramContextProvider"
    );
  }
  return context;
}

export {
  DeepgramContextProvider,
  useDeepgram,
  LiveConnectionState,
  LiveTranscriptionEvents,
  type LiveTranscriptionEvent,
}; 