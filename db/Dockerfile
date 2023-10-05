# 사용할 베이스 이미지를 선택합니다. 여기서는 공식 PostgreSQL 이미지를 사용합니다.
FROM postgres:latest
# bash 설치
RUN apt update && apt install bash

# 환경 변수를 설정하여 PostgreSQL 데이터베이스를 생성합니다.
ENV POSTGRES_DB test_db
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD 1234

# 컨테이너가 시작될 때 실행할 초기 SQL 스크립트를 복사합니다.
# COPY init.sql /docker-entrypoint-initdb.d/

# 포트를 노출합니다. 기본 PostgreSQL 포트는 5432입니다.
EXPOSE 5432
