FROM oven/bun:alpine
LABEL authors="liamthexpl0rer"

# Copy the repo into the container
WORKDIR /app
COPY . /app

RUN bun install

# Run the application when the container starts
ENTRYPOINT ["bun", "run", "dev"]