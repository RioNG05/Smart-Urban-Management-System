#!/bin/bash

echo "Waiting for SQL Server..."

sleep 25

echo "Running SUMS.sql..."

/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Sums@!2026" -i /init.sql -C

echo "Done import database!"