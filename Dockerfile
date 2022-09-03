FROM mcr.microsoft.com/playwright:v1.25.0-focal

ENV PATH /node_modules/.bin:$PATH

RUN npx playwright-chromium install --with-deps

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . ./

ENTRYPOINT ["node", "dist/index.js"]
