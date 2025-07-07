#!/bin/sh
set -ex

docker build -t herobot . && \
docker run -it --rm \
--name herobot \
-p 9001:8080 \
herobot
