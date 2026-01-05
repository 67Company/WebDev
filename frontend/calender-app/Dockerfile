FROM oven/bun:1 AS build
WORKDIR /app

# Copy manifests (bun.lockb is optional)
COPY package.json bun.lockb* ./
RUN bun install

# Copy source and build
COPY . .
# CRA build via bun
RUN bun run build
# sanity check
RUN test -d build || (echo "build folder missing after CRA build" && exit 1)

FROM nginx:alpine
# CRA outputs to /app/build
COPY --from=build /app/build /usr/share/nginx/html
# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]