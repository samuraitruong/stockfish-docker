FROM ubuntu as builder
ARG VERSION=15.1

WORKDIR /chess

RUN  apt-get update \
    && apt-get install -y wget  build-essential\
    && rm -rf /var/lib/apt/lists/*

RUN wget "https://github.com/official-stockfish/Stockfish/archive/refs/tags/sf_$VERSION.tar.gz" && tar -xf "sf_$VERSION.tar.gz" -C /chess && rm *.gz 


WORKDIR /chess/Stockfish-sf_$VERSION/src
RUN make net && make build ARCH=x86-64-modern


FROM ubuntu
ARG NODE_VERSION=16
ARG VERSION=15.1
WORKDIR /app
COPY --from=builder /chess/Stockfish-sf_$VERSION/src/stockfish ./stockfish
ENV STOCKFISH_PATH=/app/stockfish


RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y curl gnupg && \
    curl -sL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app/api

COPY ./api /app/api

RUN npm install
EXPOSE 3000
EXPOSE 8080
ENTRYPOINT [ "npm", "start" ]