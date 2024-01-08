exports[`Install sail > generate compose.yml file 1`] = `"# For more information: https://github.com/julien-r44/adonis-sail
services:
  redis:
    image: redis:alpine
    hostname: redis
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

  pgsql:
    image: 'postgres:15'
    ports:
      - '\${PG_PORT:-5432}:5432'
    environment:
      PGPASSWORD: '\${PG_PASSWORD:-secret}'
      POSTGRES_DB: '\${PG_DB_NAME:-default}'
      POSTGRES_USER: '\${PG_USER}'
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
  sailredis:
  sailpgsql:
"`

