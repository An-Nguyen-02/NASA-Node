const request = require('supertest')
const app = require('../../app')
const {mongoConnect, mongoDisconnect} = require('../../services/mongo')
const {
    loadPlanetsData
} = require('../../models/planets.model')
describe('Test launches API', () => {
    beforeAll(async () => {
        await mongoConnect()
        await loadPlanetsData()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })
    describe('GET/launches',() => {
        test ('Get all launches', async () => {
            const response = await request(app)
                            .get('/launches')
                            .expect('Content-Type',/json/)
                            .expect(200)
        })
    })
    
    describe('POST/launches',() => {
        const defaultDate = 'January 20, 2025'
        const launchWithDate = {
                        mission: 'test',
                        target: 'Kepler-442 b',
                        rocket: 'Tesla X',
                        launchDate: defaultDate
                    }
        const launchWithoutDate = {
                    mission: 'test',
                    target: 'Kepler-442 b',
                    rocket: 'Tesla X',
                }
        const launchWithWrongDate = {
                    mission: 'test',
                    target: 'Kepler-442 b',
                    rocket: 'Tesla X',
                    launchDate: 'hello'
        }
        test ('Post correct', async () => {
            const response = await request(app)
                            .post('/launches')
                            .send(launchWithDate)
                            .expect(201)
                            .expect('Content-Type',/json/)
            expect(response.body).toMatchObject(launchWithoutDate)
            const requestDate = new Date(defaultDate).valueOf()
            const responseDate = new Date(response.body.launchDate).valueOf()
            expect(responseDate).toBe(requestDate)               
        })
    
            test ('Post missing launch property', async () => {
            const response = await request(app)
                            .post('/launches')
                            .send(launchWithoutDate)
                            .expect(400)
                            .expect('Content-Type',/json/)
            expect(response.body).toStrictEqual({
                 error: 'Missing required properties for launch'
            })
        })
    
            test ('Post wrong date', async () => {
                    const response = await request(app)
                            .post('/launches')
                            .send(launchWithWrongDate)
                            .expect(400)
                            .expect('Content-Type',/json/)
            expect(response.body).toStrictEqual({
                 error: 'wrong format date, should be for example: January 20, 2028'
            })
        })
    })
})

