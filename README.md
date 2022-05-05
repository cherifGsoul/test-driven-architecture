# test-driven-architecture

- Installl

```
npm install
```

- Copy `.env.dist` to `.env`

- create the database:

```
npx mikro-orm database:create
```

- Create the DB schema:

```
npx mikro-orm schema:create -r
```

- Run the tests:

```
npm run test
```


- Run the express app:

```
npm run start:dev
```
