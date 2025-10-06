import type { NextConfig } from "next";
import WebpackErrorReporterPlugin from "./webpack/plugins/WebpackErrorReporterPlugin";

const nextConfig: NextConfig = {
  // Separate build directory for production builds
  distDir: process.env.NODE_ENV === "production" ? ".next" : ".next-dev",
  devIndicators: false,
  // Generate standalone output for easier deployment
  output: "standalone",
 images: {
    domains: ["picsum.photos","unsplash.com"],
  },
  // Custom webpack config to handle file conflicts and path resolution
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = "eval";
      config.cache = {
        type: "filesystem",
        cacheDirectory: "/home/user/.next-cache-dev",
      };

      // Inject host error bridge as an additional entry in dev so LLM edits won't remove it
      if (typeof config.entry === "function") {
        const originalEntry = config.entry;
        config.entry = async () => {
          const entries = await originalEntry();
          const bridgePath = require("path").resolve(
            __dirname,
            "./host-error-bridge.ts",
          );
          if (entries && typeof entries === "object") {
            // Ensure main app entry exists
            if (Array.isArray((entries as any).app)) {
              (entries as any).app.unshift(bridgePath);
            } else if ((entries as any)["main-app"]) {
              (entries as any)["main-app"] = [
                bridgePath,
                ...(entries as any)["main-app"],
              ];
            } else {
              // Fallback: append to all entry arrays
              for (const key of Object.keys(entries)) {
                if (Array.isArray((entries as any)[key])) {
                  (entries as any)[key].unshift(bridgePath);
                }
              }
            }
          }
          return entries;
        };
      }

      config.plugins.push(
        new WebpackErrorReporterPlugin(
          process.env.NEXT_PUBLIC_PROJECT_ID,
          process.env.NEXT_PUBLIC_WEBHOOK_BUILD_ERROR_URL,
        ),
      );
      console.log("WebpackErrorReporterPlugin registered for dev mode.");
    } else {
      config.cache = {
        type: "filesystem",
        cacheDirectory: "/home/user/.next-cache-build",
      };
    }
    // Handle missing modules gracefully
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };

    return config;
  },

  // Transpile packages that might cause issues
  transpilePackages: ["@radix-ui/react-accordion", "lucide-react"],

  // TypeScript configuration - allow errors to be caught by webpack
  typescript: {
    // Don't ignore build errors so webpack can catch and report them
    ignoreBuildErrors: false,
  },

  // ESLint configuration - allow errors to be caught by webpack
  eslint: {
    // Don't ignore errors during builds so webpack can catch and report them
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
