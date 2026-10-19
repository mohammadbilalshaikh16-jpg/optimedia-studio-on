# OptiMedia Studio - Cloudflare Pages & Free Hosting Deployment Guide

OptiMedia Studio now processes all images and videos **100% client-side in the user's browser**. Because media is processed locally on each user's PC or laptop without uploading files to a server, the entire project can be hosted on **Cloudflare Pages** for free with unlimited bandwidth, zero server costs, and instant global CDN delivery.

---

## Performance Notice

> **Optimization speed depends on your device's hardware specifications. Computers with faster processors, sufficient RAM, and better hardware capabilities may complete optimization faster. Larger videos and lower-power devices may require more time.**

---

## 1. Deploying to Cloudflare Pages (Recommended - 100% Free & Serverless)

Cloudflare Pages provides free static hosting with zero backend server maintenance, automatic free SSL, and worldwide caching.

### Step-by-Step Instructions:

1. **Push your code to GitHub**:
   Ensure your repository (`mohammadbilalshaikh16-jpg/optimedia-studio-v2`) contains the project files (`package.json`, `src/`, `public/`, etc.).

2. **Sign up / Log in to Cloudflare**:
   Go to [https://dash.cloudflare.com](https://dash.cloudflare.com) and create a free account.

3. **Create a Pages Project**:
   - In the left sidebar, click **Workers & Pages**.
   - Click **Create application**, then choose the **Pages** tab.
   - Click **Connect to Git** and authorize your GitHub account.
   - Select your repository: `mohammadbilalshaikh16-jpg/optimedia-studio-v2`.

4. **Configure Build Settings**:
   - **Project name**: `optimedia-studio` (or your preferred name)
   - **Production branch**: `main`
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: *(leave empty)*

5. **Environment Variables**:
   - Click **Environment variables (advanced)**.
   - Add variable:
     - Variable name: `NODE_VERSION`
     - Value: `20`
   *(Also automatically handled by `.nvmrc`)*

6. **Deploy**:
   - Click **Save and Deploy**.
   - Cloudflare will run `npm run build` in ~40 seconds.
   - Once complete, your website will be live at `https://YOUR_PROJECT.pages.dev` with automatic free HTTPS!

---

## 2. In-Browser Client Engine Details

### How Browser Video Processing Works
- **No Server Uploads**: Videos stay completely private on the user's computer.
- **Conservative CPU & RAM**: Processing runs in a single-worker frame pump at target FPS. RAM consumption stays below 60 MB even when processing large files.
- **Target Rate**: Calibrated rate controller targets a ~23% file size reduction with a 93–95% perceptual visual quality floor.
- **Codec Support**:
  - **H.264 (AVC)**: Universal in MP4 on Chrome, Edge, Safari.
  - **VP9**: High efficiency in WebM on Chrome, Edge, Firefox.
  - **AV1**: Supported on browsers and hardware that genuinely support AV1 encoding.
  - **H.265 / HEVC**: Supported on Safari and Chromium with hardware HEVC capabilities.
  - If a user's browser lacks hardware support for a codec (e.g. AV1 or H.265), the engine transparently falls back to the best available codec (H.264 MP4 or VP9 WebM).

### Honest Real-World Limitations
1. **Device Speed**: Unlike high-powered server clusters, encoding speed depends on the user's local CPU/GPU. A modern laptop may encode 1080p at 1.0x–1.5x real-time speed, while an older or low-power device may take longer.
2. **Tab Keep-Alive**: Because processing runs inside the browser tab, the user should keep the tab open while long video optimizations are in progress.
3. **Codec Availability**: Browsers cannot encode codecs their underlying OS/hardware does not support (e.g., AV1 encoding requires modern browser/OS support).

---

## 3. Alternative: Docker / Render Deployment

If you still wish to run the project with the optional full-stack Docker container:

```bash
# Build Docker image
docker build -t optimedia-studio .

# Run container on port 3000
docker run -p 3000:3000 -e PORT=3000 optimedia-studio
```
On Render:
- Create a new **Web Service** from GitHub.
- Select **Docker** runtime and **Free** plan.
