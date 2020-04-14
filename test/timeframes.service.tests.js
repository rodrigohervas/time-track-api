const app = require('../src/app')
const db = require('../src/knexContext')
const { generateCompaniesTestData } = require('./companies.tests.data')
const { generateRolesTestData } = require('./roles.tests.data')
const { generateUsersTestData } = require('./users.tests.data')
const { generateTimeframesTestData } = require('./timeframes.tests.data')

const testCompanies = generateCompaniesTestData()
const testRoles = generateRolesTestData()
const testUsers = generateUsersTestData()
const testTimeframes = generateTimeframesTestData()

const companiesTable = 'companies'
const rolesTable = 'roles'
const usersTable = 'users'
const timeframesTable = 'timeframes'


beforeEach('empty all tables', () => db.raw('TRUNCATE roles, companies, users, timeframes RESTART IDENTITY CASCADE') )

afterEach('empty all tables', () => db.raw('TRUNCATE roles, companies, users, timeframes RESTART IDENTITY CASCADE') )

after('disconnect from the test db', () => {
    db.destroy()
})

const insertTestData = () => { 
    return beforeEach('insert all test data', async () => {
        await db
            .insert(testRoles)
            .into(rolesTable)
        await db
            .insert(testCompanies)
            .into(companiesTable)
        await db
            .insert(testUsers)
            .into(usersTable)
        return db
            .insert(testTimeframes)
            .into(timeframesTable)
    })
}

const formatDate = (date) => {
    return new Date(date + ' 09:00:00').toLocaleDateString('en-US')
}

const formatTime = (date, time) => {
    return new Date(date + ' ' + time).toLocaleTimeString('en-GB')
}

const formatTimeFrame = (timeframe) => (
    {
        id: timeframe.id, 
        date: formatDate(timeframe.date), 
        starttime: formatTime(timeframe.date, timeframe.starttime), 
        finishtime: formatTime(timeframe.date, timeframe.finishtime), 
        comments: timeframe.comments, 
        user_id: timeframe.user_id
    } 
)

describe('GET /api/timeframes', () => {
    
    insertTestData()

    it('GET /api/timeframes/:id => responds with specified timeframe', () => {
        const id = 3
        const timeframe = { 
            id: 3, 
            date: '2020-03-05', 
            starttime: '08:00', 
            finishtime: '17:15', 
            comments: 'none', 
            user_id: 1 
        }

        return supertest(app)
                .get(`/api/timeframes/${id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect(200)
                .expect( res => {
                    const time = res.body
                    //console.log('TIMEFRAME: ', time)
                    expect(timeframe.id).to.eql(timeframe.id)
                    expect(formatDate(timeframe.date)).to.eql(formatDate(time.date))
                    expect(formatTime(timeframe.date, timeframe.starttime)).to.eql(formatTime(time.date, time.starttime))
                    expect(formatTime(timeframe.date, timeframe.finishtime)).to.eql(formatTime(time.date, time.finishtime))
                    expect(timeframe.comments).to.eql(time.comments)
                    expect(timeframe.user_id).to.eql(time.user_id)
                })
    })

    it('GET /api/timeframes/:id responds with 404 "Not Found" when id is incorrect', () => {
        const id = 888        
        return supertest(app)
                .get(`/api/timeframes/${id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect( res => {
                    const error = res.body.error
                    expect(error.status).to.eql(404)
                    expect(error.message).to.eql('Timeframe doesn\'t exist')
                })
    })
})

describe('POST /api/timeframes/:id', () => {
        
    insertTestData()

    it('POST /api/timeframes/:id => getAllByUserId: returns all timeframes for a specified user id', () => {
        const userId = 1
        const timeframesByUserId = testTimeframes.filter(timeframe => timeframe.user_id === userId)
        const formattedTimeframes = timeframesByUserId.map( timeframe => formatTimeFrame(timeframe) )

        return supertest(app)
                .post(`/api/timeframes/${userId}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect(200)
                .expect(res => {
                    const times = res.body
                    const formattedTimes = times.map( timeframe => formatTimeFrame(timeframe) )
                    expect(formattedTimeframes).to.eql(formattedTimes)
                })
    })
})

describe('POST /api/timeframes', () => {
    
    beforeEach('insert all test data', async () => {
        await db
            .insert(testRoles)
            .into(rolesTable)
        await db
            .insert(testCompanies)
            .into(companiesTable)
        return db
            .insert(testUsers)
            .into(usersTable)
    })

    it('POST /api/timeframes => creates a timeframe, responding with 201 and the new timeframe', () => {
        const timeframe = { 
            date: '2020-04-18', 
            starttime: '09:35', 
            finishtime: '15:23', 
            comments: 'Working on project TimeTrack', 
            user_id: 1 
        }
        
        return supertest(app)
                .post('/api/timeframes')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(timeframe)
                .expect(201)
                .expect( res => {
                    const time = res.body
                    //console.log('TIME: ', time)
                    expect(formatDate(timeframe.date)).to.eql(formatDate(time.date))
                    expect(formatTime(timeframe.date, timeframe.starttime)).to.eql(formatTime(time.date, time.starttime))
                    expect(formatTime(timeframe.date, timeframe.finishtime)).to.eql(formatTime(time.date, time.finishtime))
                    expect(timeframe.comments).to.eql(time.comments)
                    expect(timeframe.user_id).to.eql(time.user_id)
                })
    })
})

describe('PUT /api/timeframes/:id', () => {
    
    insertTestData()

    it('PUT /api/timeframes/:id => updates a timeframe, responding with 201 and the updated timeframe', () => {
        const timeframe = { 
            id: 3, 
            date: '2020-04-18', 
            starttime: '09:35', 
            finishtime: '15:23', 
            comments: 'Working on project TimeTrack', 
            user_id: 1 
        }
        return supertest(app)
                .put(`/api/timeframes/${timeframe.id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(timeframe)
                .expect(201)
                .expect( res => {
                    const time = res.body
                    //console.log('TIME: ', time)
                    expect(timeframe.id).to.eql(time.id)
                    expect(formatDate(timeframe.date)).to.eql(formatDate(time.date))
                    expect(formatTime(timeframe.date, timeframe.starttime)).to.eql(formatTime(time.date, time.starttime))
                    expect(formatTime(timeframe.date, timeframe.finishtime)).to.eql(formatTime(time.date, time.finishtime))
                    expect(timeframe.comments).to.eql(time.comments)
                    expect(timeframe.user_id).to.eql(time.user_id)
                })
    })
})

describe('DELETE /api/timeframes/:id', () => {
        
    insertTestData()

    it('DELETE /api/timeframes/:id deletes a timeframe, responding with 200 and "1 timeframe/s deleted"', () => {
        const id = 3
        return supertest(app)
                .delete(`/api/timeframes/${id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect(200)
                .expect( res => {
                    const msg = res.body
                    expect(msg).to.eql('1 timeframe/s deleted')
                })
    })
})