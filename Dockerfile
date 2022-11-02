from node:14.17.1

workdir /app
copy package.json .
run npm install
copy . .
expose 8080
cmd ["/usr/local/bin/node", "index.js"]