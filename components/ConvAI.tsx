"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConversation } from "@11labs/react";
import { cn } from "@/lib/utils";

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch {
    console.error("Microphone permission denied");
    return false;
  }
}

async function getSignedUrl(): Promise<string> {
  const response = await fetch("/api/signed-url");
  if (!response.ok) {
    throw Error("Failed to get signed url");
  }
  const data = await response.json();
  return data.signedUrl;
}

export function ConvAI() {
  const conversation = useConversation({
    onConnect: () => {
      console.log("connected");
    },
    onDisconnect: () => {
      console.log("disconnected");
    },
    onError: error => {
      console.log(error);
      alert("An error occurred during the conversation");
    },
    onMessage: message => {
      console.log(message);
    },
  });

  async function startConversation() {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      alert("No permission");
      return;
    }
    const signedUrl = await getSignedUrl();
    const conversationId = await conversation.startSession({ signedUrl });
    console.log(conversationId);
  }

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const getStatusText = () => {
    if (conversation.status === "connected") {
      return conversation.isSpeaking ? "AI Speaking" : "Connected & Listening";
    }
    return "Disconnected";
  };

  return (
    <>
      {/* Animated Background */}
      <div className="tech-background" />
      <div className="particles">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      <div className="flex justify-center items-center min-h-screen px-4">
        <Card className="ai-card rounded-3xl max-w-md w-full">
          <CardContent className="p-8">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {conversation.status === "connected" && (
                    <div className="status-indicator" />
                  )}
                  <span className="status-text">
                    {getStatusText()}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            
            <div className="flex flex-col items-center gap-8">
              {/* 3D Glowing Orb */}
              <div
                className={cn(
                  "orb-3d",
                  conversation.status === "connected" && conversation.isSpeaking
                    ? "orb-active"
                    : conversation.status === "connected"
                    ? "orb-listening"
                    : ""
                )}
              />

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 w-full">
                <Button
                  className="ai-button rounded-full py-3 px-8"
                  size="lg"
                  disabled={
                    conversation !== null && conversation.status === "connected"
                  }
                  onClick={startConversation}
                >
                  Initialize Connection
                </Button>
                <Button
                  className="ai-button rounded-full py-3 px-8"
                  size="lg"
                  disabled={conversation === null || conversation.status !== "connected"}
                  onClick={stopConversation}
                >
                  Terminate Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
    </div>
  );
}
