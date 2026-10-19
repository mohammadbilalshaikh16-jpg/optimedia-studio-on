# OptiMedia Studio

> High-Performance In-Browser Media Optimization Platform with Client-Side Rate Controller

OptiMedia Studio is a modern media optimization engine designed to deliver fast, visually lossless video and image compression. Processing runs **100% locally in the user's web browser** using hardware-accelerated Canvas pipelines, native MediaRecorder encoders, and Web Audio API. Each user's own computer handles optimization without requiring a paid backend server or uploading video contents over the network.

---

## Performance Notice

> **Optimization speed depends on your device's hardware specifications. Computers with faster processors, sufficient RAM, and better hardware capabilities may complete optimization faster. Larger videos and lower-power devices may require more time.**

---

## Key Features

- **100% In-Browser Client Processing**: Videos and photos never leave your device. Zero cloud uploads and zero backend infrastructure costs.
- **Adaptive 23% Target Rate Controller**: Calibrated compression targeting a ~23% reduction in file size while aiming for a 93–95% perceptual visual quality floor.
- **Genuine Codec Detection**: Preserves H.264 (AVC), H.265 (HEVC), VP9, and AV1 only where genuinely supported by the user's browser runtime and hardware capabilities.
- **Conservative Resource Consumption**: Paced frame rendering and sequential queue execution prevent excessive CPU and RAM utilization.
- **Full Cancellation & Live Telemetry**: Real-time progress percentage, encoding speed multiplier, estimated time remaining (ETA), and instant cancellation at any point.
- **Cloudflare Pages Ready**: Zero backend required in production. Deploy as a blazing-fast static web app to Cloudflare Pages for free with unlimited bandwidth.

---

## Project Structure

```text
optimedia-studio/
├── public/                 # Static assets, Cloudflare Pages headers & redirects
│   ├── _headers            # Cloudflare Pages security & cross-origin isolation
│   └── _redirects          # Cloudflare Pages SPA client-side routing
├── .nvmrc                  # Node 20 runtime configuration for Cloudflare Pages
├── package.json            # Frontend dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── index.html              # HTML entry point with metadata and SEO
├── DEPLOYMENT.md           # Cloudflare Pages & hosting deployment guide
├── README.md               # Repository documentation
├── server.ts               # Local full-stack development runner
└── src/                    # React 19 frontend application
    ├── App.tsx             # Root component with tabs, queue, and telemetry
    ├── index.css           # Global Tailwind CSS styles
    ├── types/              # TypeScript types and optimizer schemas
    ├── utils/              # Client-side video/image optimization engines
    └── components/         # Modular UI components (TopBar, Inspector, Pages)
```

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## Production Build

To build the static application for production:

```bash
npm run build
```

The production output will be generated inside the `dist/` directory.

---

## Cloudflare Pages Free Deployment

1. Push this repository to GitHub: `mohammadbilalshaikh16-jpg/optimedia-studio-v2`.
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) > **Workers & Pages** > **Create application** > **Pages**.
3. Connect your GitHub repository.
4. Set build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**. Your site will be live on `*.pages.dev` with free SSL and infinite bandwidth!
