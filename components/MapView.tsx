"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { BitNodesData, NodeEntry, SimulationMode } from "../types";

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
        console.log("Sample node data:", Object.keys(data.nodes).slice(0, 3));
        setBitNodesData(data);

        // Update stats
        const heights = Object.values(data.nodes).map((node) => node[4]);
        const maxHeight = heights.length > 0 ? Math.max(...heights) : 0;

        onStatsUpdate({
          totalNodes: data.total_nodes,
          consensusHeight: maxHeight,
          timestamp: data.timestamp,
        });

        console.log("Setting isLoading to false");
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load bitnodes data:", error);
        setError(`Failed to load data: ${error instanceof Error ? error.message : String(error)}`);
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

    try {
      console.log("Creating MapLibre map...");
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "osm",
              type: "raster",
              source: "osm",
            },
          ],
        },
        center: [0, 20],
        zoom: 2,
        attributionControl: false,
        maxZoom: 18,
        minZoom: 1,
        renderWorldCopies: true,
      });

      map.current.on("load", () => {
        console.log("Map loaded successfully");
        console.log("Map container dimensions:", mapContainer.current?.offsetWidth, "x", mapContainer.current?.offsetHeight);

        // Add custom marker image
        if (map.current) {
          map.current
            .loadImage("/satoshi.svg")
            .then((response) => {
              if (response.data && map.current) {
                console.log("Satoshi image loaded successfully");
                map.current.addImage("satoshi-marker", response.data);
              }
            })
            .catch((error) => {
              console.error("Failed to load satoshi image:", error);
            });
        }
      });

      map.current.on("styledata", () => {
        console.log("Map style data loaded");
      });

      map.current.on("render", () => {
        console.log("Map rendering");
      });

      // Force a resize after a short delay to ensure proper rendering
      setTimeout(() => {
        if (map.current) {
          map.current.resize();
          console.log("Map resized");
        }
      }, 100);

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
      setError(`Failed to create map: ${error}`);
    }
  }, []);

  // Update markers based on simulation mode
  useEffect(() => {
    if (!map.current || !bitNodesData) return;

    console.log("Updating markers for mode:", simulationMode);

    // Remove existing markers
    if (map.current.getLayer("nodes")) {
      map.current.removeLayer("nodes");
    }
    if (map.current.getSource("nodes")) {
      map.current.removeSource("nodes");
    }

    const nodes = Object.entries(bitNodesData.nodes);
    let displayNodes: NodeEntry[] = [];

    if (simulationMode === "live") {
      // Show actual nodes (limited to first 1200 for performance)
      displayNodes = nodes
        .filter(([_, nodeData]) => nodeData[6] !== null && nodeData[7] !== null) // Has city and country
        .slice(0, 1200) // Limit to first 1200 nodes
        .map(([ip, nodeData]) => ({
          ip,
          status: "online",
          blockHeight: nodeData[4],
          version: nodeData[1],
          city: nodeData[6] || "Unknown",
          country: nodeData[7] || "Unknown",
          lat: nodeData[8],
          lon: nodeData[9],
        }));
    } else {
      // Generate simulated nodes based on percentage
      const percentages = {
        "0.01%": 1200, // Reduced for testing
        "0.1%": 2400, // Reduced for testing
        "1%": 3600, // Reduced for testing
      };

      const targetCount = percentages[simulationMode];
      const realNodes = nodes.filter(([_, nodeData]) => nodeData[6] !== null && nodeData[7] !== null);

      // Create simulated nodes based on real node distribution
      displayNodes = [];
      for (let i = 0; i < Math.min(targetCount, 2000); i++) {
        // Limit to 2000 for performance
        const randomRealNode = realNodes[Math.floor(Math.random() * realNodes.length)];
        const [_, nodeData] = randomRealNode;

        // Add some randomness to the position
        const lat = nodeData[8] + (Math.random() - 0.5) * 0.1;
        const lon = nodeData[9] + (Math.random() - 0.5) * 0.1;

        displayNodes.push({
          ip: `simulated-${i}`,
          status: "simulated",
          blockHeight: nodeData[4],
          version: nodeData[1],
          city: nodeData[6] || "Unknown",
          country: nodeData[7] || "Unknown",
          lat,
          lon,
        });
      }
    }

    console.log("Displaying", displayNodes.length, "nodes");

    // Add markers to map
    if (map.current && displayNodes.length > 0) {
      map.current.addSource("nodes", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: displayNodes.map((node) => ({
            type: "Feature",
            properties: {
              ip: node.ip,
              city: node.city,
              country: node.country,
              version: node.version,
              status: node.status,
              blockHeight: node.blockHeight,
            },
            geometry: {
              type: "Point",
              coordinates: [node.lon, node.lat],
            },
          })),
        },
      });

      map.current.addLayer({
        id: "nodes",
        type: "symbol",
        source: "nodes",
        layout: {
          "icon-image": "satoshi-marker",
          "icon-size": 0.5,
          "icon-allow-overlap": true,
        },
      });

      // Add click handler for popups
      map.current.on("click", "nodes", (e) => {
        if (!map.current) return;

        const coordinates = e.lngLat;
        const properties = e.features?.[0]?.properties;

        if (properties) {
          new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(
              `
              <div class="p-2 text-black">
                <div class="font-semibold">${properties.city}, ${properties.country}</div>
                <div class="text-sm mt-1">Version: ${properties.version}</div>
                <div class="text-sm">Status: ${properties.status}</div>
              </div>
            `
            )
            .addTo(map.current);
        }
      });

      // Change cursor on hover
      map.current.on("mouseenter", "nodes", () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = "pointer";
        }
      });

      map.current.on("mouseleave", "nodes", () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = "";
        }
      });
    }
  }, [bitNodesData, simulationMode]);

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
          Loading Bitcoin nodes... (Debug Mode - Simplified)
          <br />
          <small className="text-sm text-gray-400">
            Data: {bitNodesData ? "Loaded" : "Loading..."} | Map: {map.current ? "Initialized" : "Initializing..."}
          </small>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="w-full h-full relative"
      style={{
        width: "100%",
        height: "100vh",
        minHeight: "400px",
        backgroundColor: "#1a1a1a",
        position: "relative",
        zIndex: 1,
      }}
    />
  );
}
