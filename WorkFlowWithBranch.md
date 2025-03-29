# 🚀 Hướng Dẫn Chi Tiết Cách Quản Lý Nhánh Khi Code Cả Backend & Frontend
Dưới đây là hướng dẫn từng bước giúp bạn tổ chức nhánh một cách hiệu quả khi làm cả frontend và backend trong cùng một repo.

## 📌 1. Mô Hình Quản Lý Nhánh

Áp dụng khi:

✔ Dự án lớn, có nhiều người làm frontend & backend.

✔ Cần tách biệt backend và frontend để dễ quản lý.

📌 Cấu trúc nhánh:
```bash
main
│
├── frontend
│   ├── feature/frontend-login
│   ├── feature/frontend-navbar
│   ├── feature/frontend-api
│   └── ...
│
└── backend
    ├── feature/backend-auth
    ├── feature/backend-payment
    ├── feature/backend-logging
    └── ...
```

## 📌 2. Quy Trình Làm Việc Với Nhánh

1. Lấy code mới nhất từ main

Trước khi tạo nhánh mới, bạn nên chắc chắn rằng code của mình đang cập nhật mới nhất từ main.
```bash
git checkout main  # Chuyển về nhánh chính
git pull origin main  # Cập nhật code mới nhất từ remote
```

2. Tạo nhánh frontend và backend từ main:
```bash
git checkout -b frontend main
git checkout -b backend main

git push origin frontend
git push origin backend
```
3. Làm từng tính năng trên nhánh riêng:
Ví dụ, làm màn hình login cho frontend:
```bash
git checkout -b feature/frontend-login frontend
```
Hoặc làm tính năng đăng nhập ở backend:
```bash
git checkout -b feature/backend-auth backend
```
4. Commit & push code lên GitHub:
```bash
git add .
git commit -m "Thêm chức năng đăng nhập frontend"
git push origin feature/frontend-login
```
5. Tạo Pull Request (PR) để merge vào frontend hoặc backend
Sau khi code xong, merge về nhánh frontend hoặc backend.
- Khi hoàn thành code, tạo Pull Request (PR) để merge nhánh feature/frontend-login vào frontend.

- Tương tự, feature/backend-auth sẽ merge vào backend.

6. Khi frontend & backend đã ổn định, merge về main:
```bash
git checkout main
git merge frontend
git merge backend
```

7. Push lên repository để lưu lại thay đổi

```bash
git push origin main
```

8. Xóa Các Nhánh Đã Hoàn Thành

- Nếu merge thành công, bạn có thể xóa nhánh đã hoàn thành để tránh rác:
```bash
git branch -d feature/backend-auth
git branch -d feature/frontend-login
git push origin --delete feature/backend-auth
git push origin --delete feature/frontend-login
```
📌 Ưu điểm:

✅ Phân tách rõ ràng frontend và backend.

✅ Dễ kiểm soát lỗi trước khi merge vào main.

📌 Nhược điểm:

❌ Cần merge nhiều bước (feature → frontend/backend → main).

❌ Nếu frontend/backend liên quan đến nhau có thể gây khó khăn khi đồng bộ.


## 📌 3. Các Trường Hợp Đặc Biệt Và Cách Giải Quyết
🔴 1. Có Conflict Khi Merge Backend & Frontend Vào Main

Nguyên nhân:

    - Frontend và Backend có cùng thay đổi trong một file (ví dụ: package.json hoặc .gitignore).

    - Cả hai nhánh đều chỉnh sửa cùng một dòng code trong một file.

Cách giải quyết:

```bash
git checkout main
git pull origin main
git merge frontend  # Nếu có conflict, Git sẽ báo lỗi
git status  # Kiểm tra file bị conflict
```
Mở file bị conflict và sửa lỗi (chọn code đúng).

Sau đó, thêm lại file đã sửa và tiếp tục merge:
```bash
git add .
git commit -m "Resolve merge conflict"
git merge backend
```

🔴 2. Quên git pull Trước Khi Push Code
Lỗi phổ biến:
```bash
git push origin frontend
# Lỗi: rejected because the remote contains work that you do not have locally.
```
💡 Cách khắc phục:
```bash
git pull origin frontend --rebase  # Cập nhật code mới nhất
git push origin frontend
```

🔴 3. Muốn Hủy Merge Hoặc Reset Lại Code

Nếu merge sai hoặc muốn reset về trạng thái trước đó:
```bash
git reset --hard HEAD~1  # Quay về commit trước đó
```
Hoặc nếu đã push lên GitHub, dùng:
```bash
git push origin frontend --force
```

⚠ Cẩn thận khi dùng --force, vì nó có thể làm mất code của người khác!

## 📌 4. Tổng Kết

✔ Nếu làm việc trong team, tách frontend/backend giúp dễ quản lý.

✔ Nếu làm một mình hoặc dự án nhỏ, dùng chỉ một nhánh từ main sẽ nhanh hơn.

✔ Luôn git pull trước khi code để tránh conflict.

✔ Khi gặp lỗi merge, kiểm tra với git status và sửa trước khi tiếp tục.