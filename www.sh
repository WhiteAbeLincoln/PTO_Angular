#! /bin/bash
export NODE_ENV=production
export PTOMYSQL_IP='127.0.0.1'
export PTOMYSQL_PORT='3306'
export PTOMYSQL_USER='root'
export PTOMYSQL_PASSWORD='CHANGE_THIS_PASSWORD'
./bin/www;
