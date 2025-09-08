const http = require("http");
const fs = require("fs");
const path = require("path");

async function findVitePort() {
  const maxAttempts = 10;
  const startPort = 5173;
  const timeout = 30000; // 30 seconds total timeout
  const startTime = Date.now();

  console.log("🔍 Looking for Vite dev server...");

  while (Date.now() - startTime < timeout) {
    // First, try to read from temp file
    try {
      const tempFile = path.join(
        __dirname,
        "..",
        "Frontend",
        "node_modules",
        ".vite",
        "dev-server-url.txt"
      );
      if (fs.existsSync(tempFile)) {
        const url = fs.readFileSync(tempFile, "utf8").trim();
        const match = url.match(/:(\d+)/);
        if (match) {
          const port = parseInt(match[1]);
          if (await checkPort(port)) {
            console.log(
              `✅ Found Vite dev server on port ${port} (from temp file)`
            );
            return port;
          }
        }
      }
    } catch (error) {
      // Continue to port scanning
    }

    // Scan common ports
    for (let i = 0; i < maxAttempts; i++) {
      const port = startPort + i;
      if (await checkPort(port)) {
        console.log(`✅ Found Vite dev server on port ${port}`);
        return port;
      }
    }

    // Wait a bit before trying again
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(
    'Could not find Vite dev server. Make sure "npm run dev:renderer" is running.'
  );
}

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: port,
        path: "/",
        method: "GET",
        timeout: 1000,
      },
      (res) => {
        resolve(res.statusCode === 200);
      }
    );

    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Main execution
findVitePort()
  .then((port) => {
    console.log(`🚀 Vite dev server ready on port ${port}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌", error.message);
    console.log("\n💡 To fix this:");
    console.log("   1. Make sure you have two terminals open");
    console.log('   2. Run "npm run dev:renderer" in the first terminal');
    console.log('   3. Wait for it to show "Local: http://localhost:XXXX"');
    console.log('   4. Then run "npm run dev:electron" in the second terminal');
    console.log('\n   Or simply run "npm run dev" to start both together.');
    process.exit(1);
  });
