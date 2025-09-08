// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
import type { AddressInfo } from "net";

export default defineConfig(({ command }) => {
  const isBuild = command === "build";

  return {
    // ✅ Dev: "/" | Prod: "./"  (Electron file:// ke liye zaroori)
    base: isBuild ? "./" : "/",

    plugins: [
      react(),
      tailwindcss(),

      // Writes actual dev URL to node_modules/.vite/dev-server-url.txt
      {
        name: "write-dev-port",
        configureServer(server) {
          const originalListen = server.listen.bind(server);
          server.listen = (port?: number, ...args: any[]) => {
            const p = originalListen(port as any, ...args);

            Promise.resolve(p).then(() => {
              // TS-safe: read bound port from httpServer.address()
              const addr = server.httpServer?.address?.();
              let actualPort: number;

              if (typeof addr === "object" && addr !== null && "port" in addr) {
                actualPort = (addr as AddressInfo).port;
              } else if (typeof server.config.server.port === "number") {
                actualPort = server.config.server.port!;
              } else {
                actualPort = 5173;
              }

              const tempDir = path.join(process.cwd(), "node_modules", ".vite");
              fs.mkdirSync(tempDir, { recursive: true });
              fs.writeFileSync(
                path.join(tempDir, "dev-server-url.txt"),
                `http://localhost:${actualPort}`
              );
              console.log(
                `\n🚀 Vite dev server running on http://localhost:${actualPort}`
              );
            });

            return p as any;
          };
        },
      },
    ],

    resolve: {
      alias: { "@": path.resolve(__dirname, "src") },
    },

    server: {
      port: 5173,
      strictPort: false,
      host: "localhost",
    },

    clearScreen: false,

    build: {
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true,
    },
  };
});
