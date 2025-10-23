"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { BitNodesData, SimulationMode } from "../types";

interface MapViewProps {
  simulationMode: SimulationMode;
  onStatsUpdate: (stats: { totalNodes: number; consensusHeight: number; timestamp: number }) => void;
}

export default function MapView({ simulationMode, onStatsUpdate }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [bitNodesData, setBitNodesData] = useState<BitNodesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const data: BitNodesData = await response.json();
        console.log("Data loaded successfully:", data.total_nodes, "nodes");
        setBitNodesData(data);

        // Update stats
        onStatsUpdate({
          totalNodes: data.total_nodes,
          consensusHeight: Math.max(...Object.values(data.nodes).map((node) => node[4])),
          timestamp: data.timestamp,
        });

        console.log("Setting isLoading to false");
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load bitnodes data:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
        setIsLoading(false);
      }
    };

    loadData();
  }, [onStatsUpdate]);

  // Initialize map
  useEffect(() => {
    console.log("Map initialization effect running...");
    if (!mapContainer.current || map.current) {
      console.log("Skipping map init - container:", !!mapContainer.current, "map:", !!map.current);
      return;
    }

    console.log("Creating MapLibre map...");
    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: [0, 20],
        zoom: 2,
        attributionControl: false,
      });

      map.current.on("load", () => {
        console.log("Map loaded successfully");
      });

      map.current.on("error", (e) => {
        console.error("Map error:", e);
        setError(`Map error: ${e.error?.message || "Unknown error"}`);
      });

      return () => {
        if (map.current) {
          console.log("Cleaning up map...");
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error("Failed to create map:", error);
      setError(`Failed to create map: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-white text-xl">
          Loading Bitcoin nodes... (Debug Mode)
          <br />
          <small className="text-sm text-gray-400">
            Data: {bitNodesData ? "Loaded" : "Loading..."} | Map: {map.current ? "Initialized" : "Initializing..."}
          </small>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-full" style={{ width: "100%", height: "100vh" }} />;
}
