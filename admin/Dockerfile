# Sử dụng image node.js chính thức cho base image
FROM node:18-alpine AS deps

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json (nếu có)
COPY package.json package-lock.json* ./

# Cài đặt các dependencies
RUN npm install --frozen-lockfile

# Giai đoạn build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy mã nguồn và node_modules từ giai đoạn deps
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Xây dựng ứng dụng
RUN npm run build

# Giai đoạn production
FROM node:18-alpine AS runner

WORKDIR /app

# Copy các file build từ giai đoạn builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Biến môi trường NODE_ENV để đảm bảo nó chạy trong production mode
ENV NODE_ENV production

# Expose cổng 3000 để container có thể giao tiếp với bên ngoài
EXPOSE 4001

# Lệnh khởi chạy container khi chạy docker run
CMD ["npm", "start"]
