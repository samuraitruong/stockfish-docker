import fastify from "fastify";
import { Engine } from "node-uci";
const app = fastify({ logger: true });

app.get("/", async (request, reply) => {
  //   const engine = new Engine(process.env.STOCKFISH_PATH || "stockfish");
  //   await engine.init();
  //   await engine.setoption("MultiPV", "4");
  //   await engine.isready();
  //   // console.log("engine ready", engine.id, engine.options);
  //   await engine.quit();
  return { ready: true, stockfish_version: process.env.STOCKFISH_VERSION };
});

app.get("/bestmove", async (request, reply) => {
  const engine = new Engine(process.env.STOCKFISH_PATH || "stockfish");
  await engine.init();
  await engine.setoption("MultiPV", "4");
  await engine.isready();
  // console.log("engine ready", engine.id, engine.options);
  if (request.query.fen) {
    console.log("FEN", request.query.fen);
    await engine.position(request.query.fen);
  }
  const result = await engine.go({ nodes: 2500000 });
  //console.log("result", result);
  await engine.quit();
  return { result };
});

app.get("/bestmove1", async (request, reply) => {
  const engine = new Engine(process.env.STOCKFISH_PATH || "stockfish");
  await engine.init();
  await engine.setoption("MultiPV", "4");
  await engine.isready();
  // console.log("engine ready", engine.id, engine.options);
  if (request.query.fen) {
    console.log("FEN", request.query.fen);
    await engine.position(request.query.fen);
  }
  const result = await engine.go({ nodes: 10000 });
  //console.log("result", result);
  await engine.quit();
  return { result };
});

app.get("/bestmove2", async (request, reply) => {
  const engine = new Engine(process.env.STOCKFISH_PATH || "stockfish");
  await engine.init();
  await engine.setoption("MultiPV", "4");
  await engine.isready();
  // console.log("engine ready", engine.id, engine.options);
  if (request.query.fen) {
    console.log("FEN", request.query.fen);
    await engine.position(request.query.fen);
  }
  const result = await engine.go({ depth: 20 });
  //console.log("result", result);
  await engine.quit();
  return { result };
});



const start = async () => {
  const port = process.env.PORT || 3000;
  try {
    await app.listen({ port, host: "0.0.0.0" });
    console.log("Stockfish API Server started at: " + port);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
