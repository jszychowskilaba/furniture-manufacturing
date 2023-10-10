FROM node:18.16

RUN mkdir -p /home/app

COPY . /home/app

EXPOSE 3000

CMD ["node", "/home/app/dist/server.js"]

## Command for building the image
# docker build -t app:0.0.0 .