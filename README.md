# contact-entry-system-api

1. Build the project as follows:
```shell
npm install
```

2. Start up the database

```shell
./startdb.sh
```

3. Start the server in a new terminal tab
```shell
./startServer.sh
```

## Run integration tests (I use a separate database for testing purposes)
```shell
npm run testMigrate
npm test
```

## See code coverage (will generate in coverage/lcov-report/index.html)
```shell
node_modules/jest/bin/jest.js --coverage
```