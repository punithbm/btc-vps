"use client";

import { SimulationMode } from "../types";

interface TestMapViewProps {
  simulationMode: SimulationMode;
  onStatsUpdate: (stats: { totalNodes: number; consensusHeight: number; timestamp: number }) => void;
}

export default function TestMapView({ simulationMode, onStatsUpdate }: TestMapViewProps) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-white text-xl">
        Test Map View Loaded Successfully!
        <br />
        <small className="text-sm text-gray-400">Mode: {simulationMode}</small>
      </div>
    </div>
  );
}
