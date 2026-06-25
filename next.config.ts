import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Lock this app as Turbopack root so a stray ~/package-lock.json does not become the workspace root. */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  turbopack: {
    root: projectRoot,
  },
  // Serve the standalone, static design-system reference (public/DS) at the bare /DS entry point.
  async rewrites() {
    return [
      { source: "/DS", destination: "/DS/index.html" },
      { source: "/DS/", destination: "/DS/index.html" },
      { source: "/DS/Audits", destination: "/DS/Audits/index.html" },
      { source: "/DS/Audits/", destination: "/DS/Audits/index.html" },
    ];
  },
  async redirects() {
    return [
      { source: "/DS/Report-v:slug", destination: "/DS/Audits/Report-v:slug/index.html", permanent: true },
      { source: "/DS/Report-v:slug/", destination: "/DS/Audits/Report-v:slug/index.html", permanent: true },
      { source: "/DS/Report-v:slug/index.html", destination: "/DS/Audits/Report-v:slug/index.html", permanent: true },
    ];
  },
};

export default nextConfig;
