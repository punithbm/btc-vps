"use client";

import { useState } from "react";
import { SimulationMode } from "../types";

interface OverlayProps {
  totalNodes: number;
  consensusHeight: number;
  timestamp: number;
  onSimulationModeChange: (mode: SimulationMode) => void;
}

export default function Overlay({ totalNodes, consensusHeight, timestamp, onSimulationModeChange }: OverlayProps) {
  const [currentMode, setCurrentMode] = useState<SimulationMode>("live");

  const handleModeChange = (mode: SimulationMode) => {
    setCurrentMode(mode);
    onSimulationModeChange(mode);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <>
      {/* Top-right simulation mode toggle */}
      <div className="absolute top-4 right-4 z-10 pointer-events-auto">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 flex gap-2">
          {(["live", "0.01%", "0.1%", "1%"] as SimulationMode[]).map((mode) => (
            <button key={mode} onClick={() => handleModeChange(mode)} className={`px-3 py-2 rounded text-sm font-medium transition-all duration-200 ${currentMode === mode ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
              {mode === "live" ? "Live" : mode}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom-left stats */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Total reachable nodes: {formatNumber(totalNodes)}</span>
            </div>
            <div className="text-sm text-gray-300">Consensus height: {consensusHeight.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Last updated: {formatTimestamp(timestamp)}</div>
          </div>
        </div>
      </div>

      {/* Simulation info overlay */}
      {currentMode !== "live" && (
        <div className="absolute top-20 right-4 z-10">
          <div className="bg-orange-500/90 backdrop-blur-sm rounded-lg p-3 text-white">
            <div className="text-sm font-medium">Simulation Mode: {currentMode} of global population</div>
            <div className="text-xs text-orange-100 mt-1">Showing {formatNumber(currentMode === "0.01%" ? 1200 : currentMode === "0.1%" ? 2400 : 3600)} simulated nodes</div>
          </div>
        </div>
      )}
    </>
  );
}
