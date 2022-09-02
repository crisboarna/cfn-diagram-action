FROM node:16.17.0-buster-slim

#RUN apt-get update -qq  \
#    && export DEBIAN_FRONTEND=noninteractive \
#    && apt-get install -y --no-install-recommends \
#      python3 \
#    && apt-get autoremove -y  && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY . .

RUN yarn install --production

ENTRYPOINT ["node", "dist/index.js"]
