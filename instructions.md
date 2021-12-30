The package has been installed.

Make sure to install and configure `@adonisjs/redis` or `@adonisjs/lucid` if you want to use containers for your database or redis instance.
Otherwise, you will have to manually add some values to your `.env` : `DB_CONNECTION` and the `*_HOST` variables of the different databases.

Now you can set some variables in your environment file. In particular `*_USER`, `*_DATABASE`, `*_PASSWORD`. These variables will be used by the `docker-compose.yml` file. Look inside to see which ones are used.

Once this is done you can run the command `node ace install:sail` and select the services you want. A `docker-compose.yml` file will be created at the root of your project, you just have to launch it by doing `docker-compose up -d`.
