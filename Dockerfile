FROM node:18.16.0-alpine3.17

EXPOSE 3000

RUN apk add --no-cache libc6-compat
RUN ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN apk update && \
  apk upgrade && \
  apk add git

RUN mkdir /app
WORKDIR /app
ADD package.json yarn.lock /app/
RUN yarn --pure-lockfile --silent
ADD . /app

CMD ["yarn", "start"]
