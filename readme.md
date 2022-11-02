##### nginx-webrtc

1. 在`cert`文件下创建自己的ip、域名证书

```shell
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem -subj "/C=CN/ST=ShangHai/L=ShangHai/O=Mypanda Inc./OU=Web Security/CN=127.0.0.1"
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
```

2. 在`docker`环境下直接运行`run.sh`

3. 使用两个电脑，访问`https://IP:8086/index.html?room=1`
