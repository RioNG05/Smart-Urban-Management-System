#!/bin/bash

# Đường dẫn file đánh dấu trong Volume (sẽ tồn tại vĩnh viễn trừ khi xóa Volume)
FLAG_FILE="/var/opt/mssql/.init_done"

# Đợi SQL Server khởi động hoàn toàn
echo "Waiting for SQL Server to start..."
for i in {1..50}; do
    # Kiểm tra xem SQL Server đã sẵn sàng chưa
    /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Sums@!2026" -C -Q "SELECT 1" > /dev/null 2>&1
    if   [ $? -eq 0 ]; then
        echo "SQL Server is up and ready!"
        break
    fi
    echo "Still waiting for SQL Server (attempt $i)..."
    sleep 2
done

# Kiểm tra nếu đã có file đánh dấu thì bỏ qua việc chạy SQL
if [ -f "$FLAG_FILE" ]; then
    echo "--------------------------------------------------------"
    echo "Database already initialized. Skipping SQL import."
    echo "Your data is safe and will not be overwritten."
    echo "--------------------------------------------------------"
else
    echo "Starting database initialization for the first time..."
    
    # Chạy file SQL để tạo Database và các bảng
    /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Sums@!2026" -i /init.sql -C
    
    # Tạo file đánh dấu sau khi khởi tạo thành công
    touch "$FLAG_FILE"
    echo "Database initialization completed successfully!"
fi