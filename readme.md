### Stockfish engine run as docker


### Usage

```sh
docker run ghcr.io/samuraitruong/stockfish-docker:14.1 stockfish

```

The stockfish executable is added to PATH as STOCKFISH_PATH


### Local development

```
cd api
STOCKFISH_PATH=path/to/stockfish npm run dev
```

or with docker

docker-compose up


After the API runs, you can access using the following URL

```
curl http://localhost:3000/bestmove?fen=rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R%20b%20KQkq%20-%201%202 | jq .

or 

curl http://localhost:3000/bestmove?fen=K1k5/P1Pp4/1p1P4/8/p7/P2P4/8/8 w - - 0 1&depth=18 | jq .
```


The API default will run on 3000, the container exposes 2 ports `3000` and `8080`


### Stockfist UCI commands:

https://gist.github.com/aliostad/f4470274f39d29b788c1b09519e67372
