The package has been installed.

Make sure to install and configure `@adonisjs/redis` or `@adonisjs/lucid` if you want to use containers for your database or redis instance.
Otherwise, you will have to configure your `.env` file yourself.

Once this is done you can run the command `node ace install:sail`, select the services you want. A `docker-compose.yml` file will be created at the root of your project, you just have to launch it by doing `docker-compose up -d`.
