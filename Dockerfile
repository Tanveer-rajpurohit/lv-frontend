FROM node:20-alpine AS builder

WORKDIR /app


ARG NEXT_PUBLIC_API_BASE_URL="https://app.lawvriksh.com/"
ARG NEXT_PUBLIC_WS_URL_GRAMMER_SPELL="https://app.lawvriksh.com/api/ai/ws/spell-grammer/check"

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_WS_URL_GRAMMER_SPELL=${NEXT_PUBLIC_WS_URL_GRAMMER_SPELL}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

RUN chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]




# run the following command to build the docker image and push to AWS ECR
#aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 855098432083.dkr.ecr.ap-south-1.amazonaws.com
# docker build --platform=linux/amd64 \
#     --build-arg NEXT_PUBLIC_API_BASE_URL="https://app.lawvriksh.com/" \
#     --build-arg NEXT_PUBLIC_WS_URL_GRAMMER_SPELL="https://app.lawvriksh.com/api/ai/ws/spell-grammer/check" \
#     -t frontend:dev .
#docker tag frontend:dev 855098432083.dkr.ecr.ap-south-1.amazonaws.com/project-frontend:latest
#docker push 855098432083.dkr.ecr.ap-south-1.amazonaws.com/project-frontend:latest

#docker run -p 8000:8000 --name frontend_container frontend:dev