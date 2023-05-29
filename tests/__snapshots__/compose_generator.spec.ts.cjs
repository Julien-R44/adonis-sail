exports[`Compose Generator > should generate docker-compose.yml file`] = `"# For more information: https://github.com/julien-r44/adonis-sail
version: '3'

services:
  mysql:
    image: 'mysql/mysql-server:8.0'
    container_name: mysql
    ports:
      - '\${MYSQL_PORT:-3306}:3306'
    environment:
      MYSQL_ROOT_PASSWORD: '\${MYSQL_PASSWORD}'
      MYSQL_ROOT_HOST: \\"%\\"
      MYSQL_DATABASE: '\${MYSQL_DB_NAME:?err}'
      MYSQL_USER: '\${MYSQL_USER:?err}'
      MYSQL_PASSWORD: '\${MYSQL_PASSWORD?:err}'
      MYSQL_ALLOW_EMPTY_PASSWORD: 1
    volumes:
      - 'sailmysql:/var/lib/mysql'
    networks:
      - sail
    healthcheck:
      test: [\\"CMD\\", \\"mysqladmin\\", \\"ping\\", \\"-p\${MYSQL_PASSWORD}\\"]
      retries: 3
      timeout: 5s

  pgsql:
    image: 'postgres:13'
    container_name: pgsql
    ports:
      - '\${PG_PORT:-5432}:5432'
    environment:
      PGPASSWORD: '\${PG_PASSWORD:-secret}'
      POSTGRES_DB: '\${PG_DB_NAME:-default}'
      POSTGRES_USER: '\${PG_USER?:err}'
      POSTGRES_PASSWORD: '\${PG_PASSWORD:-secret}'
    volumes:
      - 'sailpgsql:/var/lib/postgresql/data'
    networks:
      - sail
    healthcheck:
      test: [\\"CMD\\", \\"pg_isready\\", \\"-q\\", \\"-d\\", \\"\${PG_DB_NAME:-default}\\", \\"-U\\", \\"\${PG_USER}\\"]
      retries: 3
      timeout: 5s


networks:
  sail:
    driver: bridge

volumes:
  sailmysql:
  sailpgsql:
"`

exports[`Compose Generator > should generate docker-compose.yml file with selected services`] = `"# For more information: https://github.com/julien-r44/adonis-sail
version: '3'

services:
  mysql:
    image: 'mysql/mysql-server:8.0'
    container_name: mysql
    ports:
      - '\${MYSQL_PORT:-3306}:3306'
    environment:
      MYSQL_ROOT_PASSWORD: '\${MYSQL_PASSWORD}'
      MYSQL_ROOT_HOST: \\"%\\"
      MYSQL_DATABASE: '\${MYSQL_DB_NAME:?err}'
      MYSQL_USER: '\${MYSQL_USER:?err}'
      MYSQL_PASSWORD: '\${MYSQL_PASSWORD?:err}'
      MYSQL_ALLOW_EMPTY_PASSWORD: 1
    volumes:
      - 'sailmysql:/var/lib/mysql'
    networks:
      - sail
    healthcheck:
      test: [\\"CMD\\", \\"mysqladmin\\", \\"ping\\", \\"-p\${MYSQL_PASSWORD}\\"]
      retries: 3
      timeout: 5s

  pgsql:
    image: 'postgres:13'
    container_name: pgsql
    ports:
      - '\${PG_PORT:-5432}:5432'
    environment:
      PGPASSWORD: '\${PG_PASSWORD:-secret}'
      POSTGRES_DB: '\${PG_DB_NAME:-default}'
      POSTGRES_USER: '\${PG_USER?:err}'
      POSTGRES_PASSWORD: '\${PG_PASSWORD:-secret}'
    volumes:
      - 'sailpgsql:/var/lib/postgresql/data'
    networks:
      - sail
    healthcheck:
      test: [\\"CMD\\", \\"pg_isready\\", \\"-q\\", \\"-d\\", \\"\${PG_DB_NAME:-default}\\", \\"-U\\", \\"\${PG_USER}\\"]
      retries: 3
      timeout: 5s

  redis:
    image: redis:alpine
    hostname: redis
    container_name: redis
    ports:
      - \\"\${REDIS_PORT:-6379}:6379\\"
    healthcheck:
      test: [\\"CMD\\", \\"redis-cli\\", \\"ping\\"]
      retries: 3
      timeout: 5s
    volumes:
      - 'sailredis:/data'
    networks:
      - sail

  minio:
    image: 'minio/minio:latest'
    container_name: 'minio'
    ports:
      - '\${MINIO_PORT:-9000}:9000'
      - '\${MINIO_CONSOLE_PORT:-8900}:8900'
    environment:
      MINIO_ROOT_USER: 'sail'
      MINIO_ROOT_PASSWORD: 'password'
    volumes:
      - 'sailminio:/data/minio'
    networks:
      - sail
    command: minio server /data/minio --console-address \\":8900\\"
    healthcheck:
      test: [\\"CMD\\", \\"curl\\", \\"-f\\", \\"http://localhost:9000/minio/health/live\\"]
      retries: 3
      timeout: 5s


networks:
  sail:
    driver: bridge

volumes:
  sailmysql:
  sailpgsql:
  sailredis:
  sailminio:
"`

exports[`Compose Generator > should add volumes for services with volumes`] = `"# For more information: https://github.com/julien-r44/adonis-sail
version: '3'

services:
  mysql:
    image: 'mysql/mysql-server:8.0'
    container_name: mysql
    ports:
      - '\${MYSQL_PORT:-3306}:3306'
    environment:
      MYSQL_ROOT_PASSWORD: '\${MYSQL_PASSWORD}'
      MYSQL_ROOT_HOST: \\"%\\"
      MYSQL_DATABASE: '\${MYSQL_DB_NAME:?err}'
      MYSQL_USER: '\${MYSQL_USER:?err}'
      MYSQL_PASSWORD: '\${MYSQL_PASSWORD?:err}'
      MYSQL_ALLOW_EMPTY_PASSWORD: 1
    volumes:
      - 'sailmysql:/var/lib/mysql'
    networks:
      - sail
    healthcheck:
      test: [\\"CMD\\", \\"mysqladmin\\", \\"ping\\", \\"-p\${MYSQL_PASSWORD}\\"]
      retries: 3
      timeout: 5s

  pgsql:
    image: 'postgres:13'
    container_name: pgsql
    ports:
      - '\${PG_PORT:-5432}:5432'
    environment:
      PGPASSWORD: '\${PG_PASSWORD:-secret}'
      POSTGRES_DB: '\${PG_DB_NAME:-default}'
      POSTGRES_USER: '\${PG_USER?:err}'
      POSTGRES_PASSWORD: '\${PG_PASSWORD:-secret}'
    volumes:
      - 'sailpgsql:/var/lib/postgresql/data'
    networks:
      - sail
    healthcheck:
      test: [\\"CMD\\", \\"pg_isready\\", \\"-q\\", \\"-d\\", \\"\${PG_DB_NAME:-default}\\", \\"-U\\", \\"\${PG_USER}\\"]
      retries: 3
      timeout: 5s


networks:
  sail:
    driver: bridge

volumes:
  sailmysql:
  sailpgsql:
"`

exports[`Compose Generator > write should write the generated file to disk at app root`] = `"# For more information: https://github.com/julien-r44/adonis-sail
version: '3'

services:
  mysql:
    image: 'mysql/mysql-server:8.0'
    container_name: mysql
    ports:
      - '\${MYSQL_PORT:-3306}:3306'
    environment:
      MYSQL_ROOT_PASSWORD: '\${MYSQL_PASSWORD}'
      MYSQL_ROOT_HOST: \\"%\\"
      MYSQL_DATABASE: '\${MYSQL_DB_NAME:?err}'
      MYSQL_USER: '\${MYSQL_USER:?err}'
      MYSQL_PASSWORD: '\${MYSQL_PASSWORD?:err}'
      MYSQL_ALLOW_EMPTY_PASSWORD: 1
    volumes:
      - 'sailmysql:/var/lib/mysql'
    networks:
      - sail
    healthcheck:
      test: [\\"CMD\\", \\"mysqladmin\\", \\"ping\\", \\"-p\${MYSQL_PASSWORD}\\"]
      retries: 3
      timeout: 5s

  pgsql:
    image: 'postgres:13'
    container_name: pgsql
    ports:
      - '\${PG_PORT:-5432}:5432'
    environment:
      PGPASSWORD: '\${PG_PASSWORD:-secret}'
      POSTGRES_DB: '\${PG_DB_NAME:-default}'
      POSTGRES_USER: '\${PG_USER?:err}'
      POSTGRES_PASSWORD: '\${PG_PASSWORD:-secret}'
    volumes:
      - 'sailpgsql:/var/lib/postgresql/data'
    networks:
      - sail
    healthcheck:
      test: [\\"CMD\\", \\"pg_isready\\", \\"-q\\", \\"-d\\", \\"\${PG_DB_NAME:-default}\\", \\"-U\\", \\"\${PG_USER}\\"]
      retries: 3
      timeout: 5s


networks:
  sail:
    driver: bridge

volumes:
  sailmysql:
  sailpgsql:
"`

