IMAGE=theremix/p2pwn
TAG=latest
PORT=8080

all: docker

docker:
					docker build -t $(IMAGE):$(TAG) .

run:
					docker run -t -p $(PORT):$(PORT) $(IMAGE):$(TAG)
