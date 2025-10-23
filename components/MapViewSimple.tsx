"use client";

import { useEffect, useState } from "react";
import { SimulationMode } from "../types";

interface MapViewSimpleProps {
  simulationMode: SimulationMode;
  onStatsUpdate: (stats: { totalNodes: number; consensusHeight: number; timestamp: number }) => void;
}

export default function MapViewSimple({ simulationMode, onStatsUpdate }: MapViewSimpleProps) {
  const [bitNodesData, setBitNodesData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load bitnodes data
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Starting to load bitnodes data...");
        const response = await fetch("/bitnodes.json");
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data loaded successfully:", data.total_nodes, "nodes");
        setBitNodesData(data);

        // Update stats
        onStatsUpdate({
          totalNodes: data.total_nodes,
          consensusHeight: Math.max(...Object.values(data.nodes).map((node: any) => node[4])),
          timestamp: data.timestamp,
        });

        console.log("Setting isLoading to false");
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load bitnodes data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [onStatsUpdate]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-white text-xl">
          Loading Bitcoin nodes... (Simple Debug Mode)
          <br />
          <small className="text-sm text-gray-400">
            Data: {bitNodesData ? "Loaded" : "Loading..."} | Mode: {simulationMode}
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-white text-xl">
        Map loaded successfully! (Simple Mode)
        <br />
        <small className="text-sm text-gray-400">
          Data: Loaded | Nodes: {bitNodesData?.total_nodes} | Mode: {simulationMode}
        </small>
      </div>
    </div>
  );
}
