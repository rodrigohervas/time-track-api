# Time Track API

Nodejs Express server with CRUD functionality.


## Description:

Time Track API is a Nodejs API that allows CRUD operations, to a PostgreSQL database, to store and manage employee time records and Paid-Time-Off.


## Technologies used:

Backend data repository: PostgreSQL database.

Packages used: express, morgan, cors, dotenv, helmet, winston, xss, pg, postgreSQL, knex, bcrypt.


## Live Site

[Time Track API](https://timetrackrh.herokuapp.com/)

## API Documentation:

### API key:

All API request must be made using an API Key. For testing purposes the following API key can be used:

Test API key: 6e4b0290-7ee3-4300-8e78-bf1419bf7925

If you clone this Git repository you'll want top store the API key in the .env file (more information on that below).


### Endpoints:

The API has the following endpoints: 

* users: CRUD users for the app

* timeframes: CRUD timeframes for a user

* pto: CRUD pto requests for a user

* ptodays: CRUD pto days summary for a user

### users endpoint: 

#### post => /api/users/login

Returns: a user object for the username and password

Requires: { username, password }

* username: string
* password: string

#### post => /api/users

Requires: { username, password, role_id, company }

Returns: the user object created

* username: string
* password: string
* role_id: integer
* company: string

#### put => /api/users

Returns: the user object updated

Requires: { username, password, role_id, company_id }

* username: string
* password: string
* role_id: integer
* company_id: integer

#### delete => /api/users

Returns: a string confirming the user is deleted

Requires: {username, password}

* username: string
* password: string


### timeframes endpoint: 

#### get => /api/timeframes/:id

Returns: a timeframe object for the timeframe id

Requires: { id }

* id: integer

#### post => /api/timeframes/

Returns: the timeframe created

Requires: { date, starttime, finishtime, comments, user_id }

* date: date
* starttime: datetime
* finishtime: datetime
* comments: string
* user_id: int

#### post => /api/timeframes/:id

Returns: array of timeframes objects for the user id

Requires: { id }

* id: integer

#### put => /api/timeframes/:id

Returns: the timeframe updated

Requires (querystring param): { id }
Requires (body): { date, starttime, finishtime, comments, user_id } 

* id: integer
* date: date
* starttime: datetime
* finishtime: datetime
* comments: string
* user_id: int

#### delete => /api/timeframes/:id

Requires: { id }

* id: integer

### ptos endpoint: 

#### post => /api/ptos/:id

Returns: list of ptos for the user id

Requires: { id }

* id: integer

#### post => /api/ptos/

Returns: the pto created

Requires: { user_id, type, startdate, finishdate, comments  } 

* user_id: integer
* type: integer
* startdate: date
* finishdate: date
* comments: string

#### get => /api/ptos/:id

Returns: a pto object for the id

Requires: { id }

* id: integer

### put => /api/ptos/:id

Returns: the pto updated

Requires (querystring param): { id }
Requires (body): { user_id, type, startdate, finishdate, comments  } 

* user_id: integer
* type: integer
* startdate: date
* finishdate: date
* comments: string

#### delete => /api/ptos/:id

Returns: an string confirming the pto deleted

Requires: { id }

* id: integer 

### ptodays endpoint: 

#### post => /api/ptodays/

Returns: the ptodays object created

Requires: { user_id, totaldays, useddays, availabledays  }

* user_id: integer
* totaldays: integer
* useddays: integer
* availabledays: integer

#### get => /api/ptodays/:user_id

Returns: an array of ptodays objects for the given user_id

Requires: {user_id} 

* user_id: integer

#### put => /api/ptodays/:user_id

Returns: the updated ptodays object

Requires (querystring param): { user_id }
Requires (body): totaldays, useddays, availabledays

* user_id: integer
* totaldays: integer
* useddays: integer
* availabledays: integer

#### delete => /api/ptodays/:user_id

Returns: a string confirming the user has been deleted

Requires: {user_id} 

* user_id: integer


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
    3. API_KEY=[YOUT_API_KEY_HERE]
    4. DATABASE_URL=[YOUR_CONNECTION_STRING_HERE]
    5. TEST_DATABASE_URL=[YOUR_CONNECTION_STRING_HERE]
    6. SALT_ROUNDS=10
7. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "time-track-api"`

Note. This server can be used with the following client repo: https://github.com/rodrigohervas/time-track-client
(`git clone https://github.com/rodrigohervas/time-track-client NEW-PROJECT-NAME`)


## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`


## Related Repos

[Time Track](https://timetrack.now.sh/)

[Git Hub](https://github.com/rodrigohervas/time-track-client)

