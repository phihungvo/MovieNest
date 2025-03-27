# 🚀 Cách Làm Việc Khi Code Fullstack Trong 1 Folder

Cấu trúc repo:

```bash
MovieNest/
├── movienest_api/       (backend - Spring Boot)
├── movienest_app/       (frontend - React)
└── README.md
```

✅ Workflow chuẩn nên theo
1. Tạo branch riêng cho mỗi task

- Ví dụ:
```bash
feature/frontend-sidebar
```

```bash
feature/backend-auth
```
- Không nên vừa sửa frontend vừa sửa backend trong 1 branch (trừ khi task đó yêu cầu chỉnh cả 2, ví dụ login flow)

2. Commit tách biệt

- Nếu sửa cả frontend và backend:

- Commit riêng từng phần, ví dụ:

```bash
git add movienest_app/
git commit -m "Add sidebar UI"
git add movienest_api/
git commit -m "Add JWT authentication"
```

3. Luôn pull và rebase trước khi push:
```bash
git pull origin main --rebase
git push origin main
```

4. Thường xuyên push lên remote

- Không để quá nhiều commit local chưa push vì dễ gây conflict.

# ⚔️ Nếu có Conflict xảy ra
✅ Xử lý từng trường hợp
1. Conflict giữa backend và frontend (rất hiếm)

- Nếu file backend và frontend tách biệt → gần như sẽ không bị conflict.

- Chỉ xảy ra conflict khi:

    - Cùng sửa file chung (README.md, docker-compose.yml…)

    - Có người chỉnh folder structure.

2. Conflict khi pull/rebase

- Ví dụ bạn bị như vừa rồi:
```bash
CONFLICT (modify/delete): README.md
```
- Cách xử lý:
```bash
# Kiểm tra file bị conflict

git status

# Mở file conflicted, quyết định giữ version nào
# (hoặc merge thủ công)

# Add lại sau khi sửa

git add <file>


# Tiếp tục rebase

git rebase --continue
```

3. Nếu bạn lỡ commit local và remote có commit mới → Sử dụng:
```bash
git pull origin main --rebase
# resolve conflict
git rebase --continue
git push origin main
```

# 🌈 Tóm tắt cho bạn

| Khi nào?                      | Làm gì?                                                   |
|-------------------------------|-----------------------------------------------------------|
| Code cả backend + frontend    | Commit tách biệt từng phần                                 |
| Trước khi push                | `git pull origin main --rebase`                           |
| Conflict modify/delete        | Kiểm tra file → Quyết định giữ hoặc xóa                    |
| Commit đang conflict          | `git status → git add → git rebase --continue`            |
| Không biết merge thế nào      | Có thể dùng `git mergetool` hoặc hỏi teammate / ChatGPT 😉 |
