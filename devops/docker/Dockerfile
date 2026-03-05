FROM ubuntu:24.04

RUN apt-get update && \
  apt-get install -y inotify-tools nodejs npm

COPY ./src/. /app
COPY ./package.json /app
COPY --chmod=755 ./devops/scripts/. /scripts

RUN cd /app && npm install

ENTRYPOINT [ "/scripts/notifytools.sh" ]

CMD [ "/app_data/payments", "payment", "--cba" ]