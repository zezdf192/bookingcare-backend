FROM node:14-alpine
#Chuẩn bị môi trường nodejs version 14

WORKDIR /bookingcare/backend

COPY package*.json ./

RUN npm install

RUN npm install -g @babel/core @babel/cli

COPY . .
#Dấu . thứ nhất: Copy lại tất cả các file có trong thư mục hiện tại
#Dấu . thứ hai: Lưu vào file WORKDIR docker

RUN npm run build-src
#Cài đặt file build

CMD ["npm", "run", "build"]
#Chạy dự án\

#docker build --tag node-docker
#docker run -p 8080:8080 -d node-docker