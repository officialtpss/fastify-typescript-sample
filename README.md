# Fastify-typescript-sample
Basic CRUD operation in fastify with Ajv JSON schema validator, MongoDB, Eslint, JWT Auth, OpenApi 3.0.3, Jest  and Prisma 

## Step of Project Setup

-  Install dependencies using npm:

      ```shell
      npm install 
      ```
- You have to convert .env.development to .env.

- For Database migration, Please follow this link https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/mongodb/install-prisma-client-typescript-mongodb.

- Using npx command:
  ```shell
  npx prisma migrate dev or npx prisma db push
  ```
- Run command:
  ```shell
  npm start
  ```
- Test command:
  ```shell
  npm run test
  ```
- Lint command:
  ```shell
  npm run lint
  ```
- API doc url: http://localhost:5000/docs/