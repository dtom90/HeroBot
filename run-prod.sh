#!/bin/sh
set -ex

docker build -t herobot . && \
docker run \
-d \
--rm \
--name herobot \
-p 9001:8080 \
herobot
