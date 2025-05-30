# Install dependencies only when needed
FROM node:slim AS deps

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY ./package.json ./package-lock.json* ./
RUN npm install


# Rebuild the source code only when needed
FROM node:slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

COPY ./ ./

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN echo "NODE_ENV is set to: ${NODE_ENV}"

RUN rm -rf .env && cp .env.${NODE_ENV} ./.env 

RUN npm run build

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Production image, copy all the files and run next
FROM node:slim AS runner
WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Check files again
RUN ls -a

# Install pm2
RUN npm install pm2 -g

EXPOSE 3000

CMD ["pm2-runtime", "server.js"]