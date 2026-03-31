# Docker Cheat Sheet - Smart Urban System

---

## English Version

### Basic Commands
| Purpose | Command |
| :--- | :--- |
| **Start system** | `docker-compose up -d` |
| **Stop & Remove containers** | `docker-compose down` |
| **Rebuild (After code change)** | `docker-compose up --build` |
| **View Logs** | `docker-compose logs -f` |

### Management & Debug
*   **Check status**: `docker ps`
*   **Wipe DB data**: `docker-compose down -v`
*   **Access Frontend**: `docker exec -it susm-frontend sh`
*   **Access Backend**: `docker exec -it susm-backend sh`
*   **Clean system**: `docker system prune`

---

## Bản Tiếng Việt

### Lệnh cơ bản
| Mục đích | Lệnh |
| :--- | :--- |
| **Khởi chạy hệ thống** | `docker-compose up -d` |
| **Dừng & Xóa container** | `docker-compose down` |
| **Build lại (khi đổi code)** | `docker-compose up --build` |
| **Xem Log (Theo dõi)** | `docker-compose logs -f` |

### Quản lý & Debug
*   **Kiểm tra trạng thái**: `docker ps`
*   **Xóa toàn bộ data DB**: `docker-compose down -v`
*   **Truy cập vào Frontend**: `docker exec -it susm-frontend sh`
*   **Truy cập vào Backend**: `docker exec -it susm-backend sh`
*   **Dọn dẹp hệ thống**: `docker system prune`

---

## Notes / Lưu ý:
1.  **Port Conflict / Lỗi Port**: 
Ensure ports 3000/8080 are free. / Đảm bảo các port 3000/8080 không bị trùng.
2.  **Rebuild / Cập nhật**: 
Run **Rebuild** after changing `package.json` or `.env`. / Chạy **Build lại** sau khi thay đổi `package.json` hoặc `.env`.
