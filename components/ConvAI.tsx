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

  const getOrbClasses = () => {
    const baseClasses = "w-48 h-48 rounded-full relative transition-all duration-1000 ease-in-out";
    const gradientBase = "bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600";
    const shadow = "shadow-2xl";
    
    if (conversation.status === "connected") {
      if (conversation.isSpeaking) {
        return `${baseClasses} ${gradientBase} ${shadow} shadow-emerald-400/50 animate-pulse scale-110`;
      } else {
        return `${baseClasses} ${gradientBase} ${shadow} shadow-teal-400/40 animate-bounce`;
      }
    }
    return `${baseClasses} bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 ${shadow} shadow-slate-500/20`;
  };
  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="backdrop-blur-xl bg-slate-900/80 border-cyan-500/30 rounded-3xl max-w-md w-full shadow-2xl shadow-cyan-500/20">
        <CardContent className="p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-center">
              <div className="flex items-center justify-center mb-4">
                {conversation.status === "connected" && (
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3 animate-pulse shadow-lg shadow-emerald-400/50" />
                )}
                <span className="text-emerald-300 font-bold text-xl tracking-wider uppercase">
                  {getStatusText()}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          
          <div className="flex flex-col items-center gap-8">
            {/* Animated Orb */}
            <div className="relative">
              <div className={getOrbClasses()}>
                {/* Inner glow effect */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                {/* Outer ring for connected state */}
                {conversation.status === "connected" && (
                  <div className="absolute -inset-2 rounded-full border-2 border-emerald-400/50 animate-spin" 
                       style={{ animationDuration: '3s' }} />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 w-full">
              <Button
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-full py-3 px-8 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/40 transition-all duration-300 hover:scale-105 disabled:from-slate-600 disabled:to-slate-700 disabled:shadow-none disabled:scale-100"
                size="lg"
                disabled={
                  conversation !== null && conversation.status === "connected"
                }
                onClick={startConversation}
              >
                Initialize Connection
              </Button>
              <Button
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-semibold rounded-full py-3 px-8 shadow-lg shadow-orange-500/25 hover:shadow-orange-400/40 transition-all duration-300 hover:scale-105 disabled:from-slate-600 disabled:to-slate-700 disabled:shadow-none disabled:scale-100"
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
    </div>
  );
}
