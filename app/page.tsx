"use client";

import { useState } from "react";
import MapView from "../components/MapView";
import Overlay from "../components/Overlay";
import { SimulationMode } from "../types";

export default function Page() {
  const [simulationMode, setSimulationMode] = useState<SimulationMode>("live");
  const [stats, setStats] = useState({
    totalNodes: 0,
    consensusHeight: 0,
    timestamp: 0,
  });

  const handleSimulationModeChange = (mode: SimulationMode) => {
    setSimulationMode(mode);
  };

  const handleStatsUpdate = (newStats: typeof stats) => {
    setStats(newStats);
  };

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden">
      <MapView simulationMode={simulationMode} onStatsUpdate={handleStatsUpdate} />
      <Overlay totalNodes={stats.totalNodes} consensusHeight={stats.consensusHeight} timestamp={stats.timestamp} onSimulationModeChange={handleSimulationModeChange} />
    </main>
  );
}
