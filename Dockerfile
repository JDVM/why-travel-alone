# The web app as a container image: a production build served by nginx, with
# security headers. Runs anywhere that runs containers.
#
#   docker build --build-arg REACT_APP_API_BASE_URL=https://api.example.com -t why-travel-alone-web .
#   docker run -e API_ORIGIN=https://api.example.com -p 3000:8080 why-travel-alone-web
#
# The REACT_APP_* values are fixed into the build, so build one image per
# environment (staging, production).

FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .

ARG REACT_APP_API_BASE_URL
ARG REACT_APP_SENTRY_DSN=
ARG REACT_APP_SENTRY_ENVIRONMENT=production
ARG REACT_APP_SENTRY_RELEASE=
# No inline <script> in index.html, so the Content-Security-Policy can forbid
# inline scripts; no source maps published with the site.
ENV INLINE_RUNTIME_CHUNK=false \
    GENERATE_SOURCEMAP=false
RUN test -n "$REACT_APP_API_BASE_URL" || { echo "Set --build-arg REACT_APP_API_BASE_URL"; exit 1; }
RUN npm run build

# nginx as an unprivileged user, listening on 8080.
FROM nginxinc/nginx-unprivileged:1.29-alpine
# The official image fills ${...} in templates from the environment at start.
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/build /usr/share/nginx/html
# Origins the browser may connect to, besides this site (used in the CSP):
# API_ORIGIN, e.g. https://api.example.com; SENTRY_ORIGIN, e.g.
# https://o123.ingest.us.sentry.io (only when REACT_APP_SENTRY_DSN is set).
ENV API_ORIGIN="" \
    SENTRY_ORIGIN=""
EXPOSE 8080
