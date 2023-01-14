const express = require('express')
const {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpDeleteLaunchWithId
} = require('./launches.controller')

const launchesRouter = express.Router()

launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', httpAddNewLaunch)
launchesRouter.delete('/:id', httpDeleteLaunchWithId)
module.exports = launchesRouter