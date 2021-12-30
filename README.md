<div align="center">
  <img src="https://i.imgur.com/GQLZIO7.png" width="250px" />  
  <br/>
  <h3>Adonis Sail</h3>
  <p>⛵Generate a ready-to-use docker environment for your Adonis application</p>
  <a href="https://www.npmjs.com/package/adonis-sail">
    <img src="https://img.shields.io/npm/v/adonis-sail.svg?style=for-the-badge&logo=npm" />
  </a>
  <img src="https://img.shields.io/npm/l/adonis-sail?color=blueviolet&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript" />
</div>

## Installation

```
npm i --save-dev adonis-sail
node ace configure adonis-sail
```

## Usage
Make sure to install and configure `@adonisjs/redis` or `@adonisjs/lucid` if you want to use containers for your database or redis instance.
Otherwise, you will have to manually add some values to your `.env` : `DB_CONNECTION` and the `*_HOST` variables of the different databases.

Now you can set some variables in your environment file. In particular `*_USER`, `*_DATABASE`, `*_PASSWORD`. These variables will be used by the `docker-compose.yml` file. Look inside to see which ones are used.

Once this is done you can run the command `node ace install:sail` and select the services you want. A `docker-compose.yml` file will be created at the root of your project, you now just have to launch it by doing `docker-compose up -d`.

## Available services
- PostgreSQL
- MySQL
- Redis
