# 🗺️ Bitcoin Node Map Visualization

A Next.js application that visualizes Bitcoin node distribution on a 2D world map using MapLibre GL JS. The app shows real Bitcoin nodes and includes simulation modes to demonstrate what decentralization would look like if different percentages of the global population ran Bitcoin nodes.

## ✨ Features

- **Interactive 2D World Map**: Powered by MapLibre GL JS with dark theme
- **Real Bitcoin Node Data**: Displays actual Bitcoin nodes from the bitnodes.json dataset
- **Simulation Modes**: Toggle between Live, 0.01%, 0.1%, and 1% population scenarios
- **Custom Satoshi Markers**: Bitcoin symbol markers for each node
- **Live Statistics**: Shows total nodes, consensus height, and last update timestamp
- **Responsive Design**: Built with TailwindCSS for modern, responsive UI
- **TypeScript**: Full type safety throughout the application

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bitcoin-node-map
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
├── app/
│   ├── globals.css          # Global styles with TailwindCSS
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page component
├── components/
│   ├── MapView.tsx          # MapLibre map component
│   └── Overlay.tsx          # Stats and controls overlay
├── public/
│   ├── bitnodes.json        # Bitcoin node data
│   └── satoshi.svg          # Custom Bitcoin marker
├── types/
│   └── index.ts             # TypeScript type definitions
└── ...
```

## 🎮 Usage

### Simulation Modes

- **Live**: Shows actual Bitcoin nodes (24,219 nodes)
- **0.01%**: Simulates 800,000 nodes (0.01% of global population)
- **0.1%**: Simulates 8,000,000 nodes (0.1% of global population)  
- **1%**: Simulates 80,000,000 nodes (1% of global population)

### Interactions

- **Click markers**: View node details (city, country, version, status)
- **Pan and zoom**: Navigate the map
- **Toggle modes**: Use the top-right buttons to switch simulation modes

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Maps**: MapLibre GL JS
- **Package Manager**: pnpm

## 📊 Data Format

The application uses data from `public/bitnodes.json` with the following structure:

```json
{
  "timestamp": 1729600000,
  "total_nodes": 24219,
  "nodes": {
    "138.201.7.110:8333": [70016, "/Satoshi:25.0.0/", 1761000000, 1033, 920256, "hostname", "Falkenstein", "DE", 50.476, 12.371, "timezone", "ASN", "ISP"]
  }
}
```

## 🎨 Customization

### Styling
- Modify `app/globals.css` for global styles
- Update TailwindCSS configuration in `tailwind.config.js`
- Customize map style by changing the MapLibre style URL

### Markers
- Replace `public/satoshi.svg` with your custom marker
- Update the marker loading code in `MapView.tsx`

## 📝 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Bitcoin node data from [Bitnodes](https://bitnodes.io/)
- MapLibre GL JS for the mapping library
- Next.js team for the excellent framework
