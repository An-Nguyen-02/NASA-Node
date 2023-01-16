const http = require('http')
const {mongoConnect} = require('./services/mongo')
const {port} = require('./config')
const app = require('./app')
const PORT = port | 8000
const {
    loadPlanetsData
} = require('./models/planets.model')
const {
    loadLaunchesData
} = require('./models/launches.model')
const server = http.createServer(app)



async function serveServer() {
    await mongoConnect()
    await loadPlanetsData()
    await loadLaunchesData()
    server.listen(PORT,()=>{
        console.log(`listen on port ${PORT}...`)
    })
}

serveServer()