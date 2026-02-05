FROM golang:alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o server ./ledger-service/cmd/main.go

RUN chmod +x /app/server

FROM alpine:latest

RUN apk add --no-cache ca-certificates

WORKDIR /root/

COPY --from=builder /app/server .

EXPOSE 50052

CMD ["./server"]