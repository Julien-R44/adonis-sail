<div align="center">
  <img src="https://i.imgur.com/GQLZIO7.png" width="250px" />  
  <br/>
  <h3>Adonis Sail</h3>
  <p>⛵Generate a ready-to-use local docker environment for your Adonis application</p>
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

## Available services
- PostgreSQL
- MySQL
- Redis
- MinIO
- MailHog

## Usage
Make sure to install and follow Adonis packages instructions before running Sail's commands.
`@adonisjs/redis`, `@adonisjs/lucid`, `@adonisjs/drive-*`, `@adonisjs/mail`.

Now you can set your environment variables. Many of these will also be used in the generated docker-compose (look inside once created to know which ones). Especially the *_PORT or *_PASSWORD. 

Once this is done you can run the command `node ace sail:install` and select the services you want. A `docker-compose.yml` file will be created at the root of your project, you now just have to launch it by doing `docker-compose up -d`.

You can launch again the `node ace sail:install` command at any time to add new services.

## MinIO
If you plan to use Amazon S3 to store files while running your application in its production environment, you may wish to install the MinIO service when installing Sail. MinIO provides an S3 compatible API that you may use to develop locally using Adonis's s3 storage driver without creating "test" storage buckets in your production S3 environment. If you choose to install MinIO while installing Sail, a MinIO configuration section will be added to your application's docker-compose.yml file.

You will need to [install the official Adonis drive-s3](https://docs.adonisjs.com/guides/drive#s3-driver) package to use MinIO locally. So install the package by following the documentation correctly, then in your .env file, use these variables :

```
S3_KEY=sail
S3_SECRET=password
S3_BUCKET=local
S3_REGION=us-east-1
S3_ENDPOINT=http://localhost:9000
```

And add this to `config/drive.ts` : 
```
...
  s3: {
      forcePathStyle: true, // 👈 Don't forget this !
      key: Env.get('S3_KEY'),
      secret: Env.get('S3_SECRET'),
      region: Env.get('S3_REGION'),
      bucket: Env.get('S3_BUCKET'),
      endpoint: Env.get('S3_ENDPOINT'),
  }
...
```
You can now use the `@adonisjs/drive-s3` package to store and fetch files like you would do normally on a real AWS bucket. You can also access MinIO dashboard at : http://localhost:8900/dashboard

## Databases
To connect to your application's databases from your local machine, you may use a graphical database management application such as [TablePlus](https://tableplus.com/). 
By default, exposed ports are :
- MySQL: 3306
- PostgreSQL: 5432
- Redis: 6379

## MailHog
MailHog intercepts emails sent by your application during local development and provides a convenient web interface so that you can preview your email messages in your browser.
To use MailHog install [install the official Adonis Mailer package](https://docs.adonisjs.com/guides/mailer). Follow the installation instructions, and select SMTP when prompted.
You have to set theses variables in your .env file : 
```
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USERNAME=
SMTP_PASSWORD=
```
In `config/mail.ts`, remove the `auth` part in the smtp configuration object. 
```
...
  smtp: {
    driver: 'smtp',
    host: Env.get('SMTP_HOST'),
    port: Env.get('SMTP_PORT'),
  },
...
```

You can now access the MailHog dashboard at http://localhost:8025/ to preview emails.

## Details
Currently, the Adonis application is not dockerised. I rarely encountered problems on my applications depending on the version of Node.JS I use (it happens, but with a tool like `nvm` it's usually fixed pretty quickly). 
And it's obviously easier to handle your Adonis application when it's running outside a docker container. That's why I decided not to dockerise the Adonis app.

If you think it's really necessary to dockerise the Adonis application in local development, let me know and we'll see what we can do !
