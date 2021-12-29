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
Make sure to install and configure `@adonisjs/redis` or `@adonisjs/lucid` if you want to use containers for your database or redis instance because Adonis Sail will automatically replace your environnement variables.
Otherwise, you will have to configure your .env files yourself.

Once this is done you can run the command `node ace install:sail`, select the services you want. A docker-compose.yml file will be created at the root of your project, you just have to launch the containers by doing `docker-compose up -d`.

