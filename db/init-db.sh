#!/bin/bash

# Đợi SQL Server khởi động hoàn toàn
echo "Waiting for SQL Server to start..."
for i in {1..50}; do
    # Kiểm tra xem SQL Server đã sẵn sàng chưa bằng cách chạy một lệnh đơn giản
    /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Sums@!2026" -C -Q "SELECT 1" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "SQL Server is up and ready!"
        break
    fi
    echo "Still waiting for SQL Server (attempt $i)..."
    sleep 2
done

echo "Starting database initialization..."

# Chạy file SQL để tạo Database và các bảng. 
# File SUMS.sql đã có logic 'DROP DATABASE IF EXISTS' nên chạy trực tiếp là an toàn.
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Sums@!2026" -i /init.sql -C

echo "Database initialization completed successfully!"