#!/bin/bash

# 构建镜像node-webrtc:v1
docker build -t node-webrtc:v1 .
# 删除同名容器
docker rm node-webrtc -f
# 后台启动
docker run -d -p 8085:8080 -p 8086:8081 --name="node-webrtc" node-webrtc:v1
# 前台启动
# docker run -p 8085:8080 -p 8086:8081 --name="node-webrtc" node-webrtc:v1
# 查看容器日志
# docker logs node-webrtc
# 进入容器
# docker exec -it node-webrtc /bin/bash