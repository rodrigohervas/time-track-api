# Time Track API

Nodejs Express server with CRUD functionality.

Backend data repository: PostgreSQL database.

Packages used: express, node-fetch, morgan, cors, dotenv, helmet, winston, xss, postgreSQL, knex.


## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone https://github.com/rodrigohervas/time-track-api NEW-PROJECT-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -r -Force .git`, amd then `git init`
4. Make sure that the .gitignore file is encoded as 'UTF-8'
5. Install the node dependencies `npm install`
6. Add an `.env` file with the following content:
    1. NODE_ENV='development'
    2. PORT=4000
    3. DATABASE_URL=[YOUR_CONNECTION_STRING_HERE]
    4. TEST_DATABASE_URL=[YOUR_CONNECTION_STRING_HERE]
7. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "time-track-api"`

Note. This server can be used with the following client repo: https://github.com/rodrigohervas/time-track-client
(`git clone https://github.com/rodrigohervas/time-track-client NEW-PROJECT-NAME`)


## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`


## Related Repos

https://github.com/rodrigohervas/time-track-client


## Live Site

https://timetrackrh.herokuapp.com/