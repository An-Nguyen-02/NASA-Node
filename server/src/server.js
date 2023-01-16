const http = require('http')
const {mongoConnect} = require('./services/mongo')
const app = require('./app')
const PORT = process.env.PORT | 8000
const {
    loadPlanetsData
} = require('./models/planets.model')
const server = http.createServer(app)



async function serveServer() {
    await mongoConnect()
    await loadPlanetsData()
    server.listen(PORT,()=>{
        console.log(`listen on port ${PORT}...`)
    })
}

serveServer()