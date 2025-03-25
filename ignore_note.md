# Hướng Dẫn Viết File .gitignore

## 1. Giới Thiệu
`.gitignore` là một file giúp Git bỏ qua các file và thư mục không cần thiết khi đẩy code lên repository. 
Dưới đây là hướng dẫn chi tiết về cách viết file này.

## 2. Cấu Trúc Cơ Bản
- Mỗi dòng đại diện cho một file hoặc thư mục cần bỏ qua.
- Có thể sử dụng các ký tự đặc biệt như:
    - `*` : đại diện cho nhiều ký tự bất kỳ.
    - `/` : xác định đường dẫn thư mục.
    - `!` : không bỏ qua file/thư mục cụ thể.

## 3. Các Quy Tắc Chính

### ✅ Bỏ qua một file cụ thể
```gitignore
config.json  # Bỏ qua file config.json
```

### ✅ Bỏ qua tất cả các file có phần mở rộng cụ thể
```gitignore
*.log  # Bỏ qua tất cả file .log
*.zip  # Bỏ qua tất cả file .zip
```

### ✅ Bỏ qua toàn bộ một thư mục
```gitignore
.idea/  # Bỏ qua thư mục .idea
node_modules/  # Bỏ qua thư mục node_modules
```

### ✅ Bỏ qua tất cả file trong một thư mục cụ thể
```gitignore
mvn/  # Bỏ qua thư mục mvn
mvn/*  # Bỏ qua tất cả file bên trong mvn
```

### ✅ Không bỏ qua một file trong thư mục bị bỏ qua
```gitignore
node_modules/  # Bỏ qua node_modules
!node_modules/important-file.js  # Nhưng giữ lại file này
```

### ✅ Bỏ qua tất cả nhưng giữ lại một thư mục con
```gitignore
dist/  # Bỏ qua thư mục dist
!dist/public/  # Nhưng giữ lại dist/public
```

### ✅ Áp dụng quy tắc theo cấp thư mục
```gitignore
/movienest_web/build/  # Chỉ bỏ qua build trong movienest_web
```

## 4. Cấu Hình `.gitignore` Cho Dự Án ReactJS & Spring Boot
Dưới đây là file `.gitignore` phù hợp với dự án của bạn:

```gitignore
# Bỏ qua các file hệ thống và IDE
.idea/
.DS_Store
Thumbs.db

# Bỏ qua các thư mục build và biên dịch
**/target/
**/build/
**/out/

# Bỏ qua các thư viện bên ngoài (Frontend & Backend)
**/node_modules/
**/.mvn/
**/.gradle/

# Bỏ qua file nén và tạm thời
*.zip
*.log
*.tmp

# Bỏ qua file cấu hình môi trường
.env

# Bỏ qua các file biên dịch Java
*.class

# Bỏ qua thư viện ngoài
External Libraries/
```

## 5. Kết Luận
File `.gitignore` giúp repository gọn gàng hơn và tránh đẩy lên các file không cần thiết. Bạn có thể điều chỉnh danh sách này tùy theo nhu cầu của dự án.

---
🚀 **Chúc bạn code vui vẻ!**