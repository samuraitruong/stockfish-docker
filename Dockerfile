FROM node:18-buster-slim as builder
ARG VERSION=15.1

WORKDIR /chess

RUN  apt-get update \
    && apt-get install -y wget  build-essential\
    && rm -rf /var/lib/apt/lists/*

RUN wget "https://github.com/official-stockfish/Stockfish/archive/refs/tags/sf_$VERSION.tar.gz" && tar -xf "sf_$VERSION.tar.gz" -C /chess && rm *.gz 


WORKDIR /chess/Stockfish-sf_$VERSION/src
RUN make net && make build ARCH=x86-64-modern


FROM node:18-buster-slim
ARG NODE_VERSION=16
ARG VERSION=15.1
WORKDIR /app
COPY --from=builder /chess/Stockfish-sf_$VERSION/src/stockfish ./stockfish
ENV STOCKFISH_PATH=/app/stockfish
ENV STOCKFISH_VERSION=${VERSION}
WORKDIR /app/api

COPY ./api /app/api

RUN npm install
EXPOSE 3000
EXPOSE 8080
ENTRYPOINT [ "npm", "start" ]