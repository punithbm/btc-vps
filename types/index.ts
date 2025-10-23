export interface NodeEntry {
  ip: string;
  status: string;
  blockHeight: number;
  version: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export interface BitNodesData {
  timestamp: number;
  total_nodes: number;
  nodes: Record<string, [
    number,      // protocol version
    string,      // user agent
    number,      // timestamp
    number,      // services
    number,      // block height
    string | null, // hostname
    string | null, // city
    string | null, // country code
    number,      // latitude
    number,      // longitude
    string | null, // timezone
    string | null, // ASN
    string | null  // ISP
  ]>;
}

export type SimulationMode = 'live' | '0.01%' | '0.1%' | '1%';
