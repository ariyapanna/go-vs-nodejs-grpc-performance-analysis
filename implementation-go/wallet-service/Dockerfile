FROM golang:alpine AS builder

WORKDIR /app/implementation-go

RUN apk add --no-cache git protobuf-dev

RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest && \
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

ENV PATH="$PATH:$(go env GOPATH)/bin"

COPY implementation-go/go.mod implementation-go/go.sum ./

RUN go mod download

COPY proto/ ../proto/
COPY implementation-go/ .

RUN protoc --proto_path=../proto \
    --go_out=./wallet-service \
    --go-grpc_out=./wallet-service \
    ../proto/*.proto

RUN go build -o /app/server ./wallet-service/cmd/main.go

FROM alpine:latest

RUN apk add --no-cache ca-certificates

WORKDIR /root/

COPY --from=builder /app/server .

EXPOSE 50053

CMD ["./server"]