import { createServer } from "./src/server";

// Use Bun's hot module replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}

createServer(process.env.PORT ? parseInt(process.env.PORT) : 3000);
