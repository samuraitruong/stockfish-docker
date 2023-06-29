import fastify from "fastify";
import { Engine } from "node-uci";

const envToLogger = {
  development: {
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

const app = fastify({
  logger: envToLogger[process.env.NODE_ENV || "development"],
});

async function getBestMove(fen, options = {}, goOptions = { depth: 18 }) {
  const engine = new Engine(process.env.STOCKFISH_PATH || "stockfish");
  await engine.init();

  for await (const [key, value] of Object.entries(options)) {
    await engine.setoption(key, `${value}`);
  }

  await engine.isready();
  if (fen) {
    app.log.info("FEN", fen);
    await engine.position(fen);
  }
  const executeOptions = { depth: 2, ...goOptions };

  const result = await engine.go(executeOptions);
  await engine.quit();
  // sort by score
  // return result;

  result.info.sort((a, b) => {
    // if (a.score?.multipv === b.score?.multipv) {
    //   return b.score?.value - a.score?.value;
    // }
    return b.score?.value - a.score?.value;
  });
  return { result, fen };
}

app.get("/", async (request, reply) => {
  return { ready: true, stockfish_version: process.env.STOCKFISH_VERSION };
});

app.get("/bestmove", async (request, reply) => {
  return await getBestMove(
    request.query.fen,
    { MultiPV: 4 },
    { depth: 18, ...request.query }
  );
});

// get bestmove but restricted elo
app.get("/bestmove/:elo", async (request, reply) => {
  const { elo } = request.params;

  return await getBestMove(
    request.query.fen,
    { UCI_LimitStrength: "true", UCI_Elo: elo, MultiPV: 4 },
    request.query
  );
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
