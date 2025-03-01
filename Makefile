# Variables
IMAGE_NAME = app_docker_image
CONTAINER_NAME = app_container
PORT = 5173

install-deps:
	npm install

run:
	npx vite

build:
	npx vite build
	find . -type f ! -name 'Makefile' ! -name '.git' ! -path './.git/*' ! -name '.gitignore' ! -path './dist/*' -exec rm -rf {} +
	mv dist/* .
	rmdir dist app


# Docker clean
docker-full-clean:
	docker system prune -a -f

# Build Docker image
#build:
#	docker build -t $(IMAGE_NAME) .

# Run Docker container
up:
	docker run -d --name $(CONTAINER_NAME) -p $(PORT):$(PORT) $(IMAGE_NAME) 
	docker logs -f $(CONTAINER_NAME)

# Stop Docker container
down:
	docker stop $(CONTAINER_NAME) && docker rm $(CONTAINER_NAME)

# Access Docker container shell
shell:
	docker exec -it $(CONTAINER_NAME) /bin/bash
