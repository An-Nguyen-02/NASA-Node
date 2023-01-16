const launches = require('./launches.mongoose')
const planets = require('./planets.mongoose')

const DEFAULT_FLIGHT_NUM = 0
let latestFlightNum = 100;

const launch = {
    flightNumber: 100,
    mission: 'mission 1',
    launchDate: new Date('December 10, 2030'),
    rocket: 'Space X',
    target: 'Kepler-442 b',
    customers: ['An', 'NASA'],
    upcoming: true,
    success: true
}

const saveLaunch = async (launch) => {
    const planet = await planets.findOne({kepler_name: launch.target})
    if (!planet){
        throw new Error('No matching planet found')
    }
    await launches.findOneAndUpdate({
        flightNumber : launch.flightNumber
    }, launch, {
        upsert: true
    })
}

saveLaunch(launch)

const getLatestFlightNum = async () => {
    const latestLaunch =  await launches.findOne().sort('-flightNumber')
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUM
    }
    return latestLaunch.flightNumber
}

const addNewLaunch = async (launch) => {
    const latestFlightNum = (await getLatestFlightNum()) + 1
    const newLaunch = Object.assign(launch, {
        flightNumber: latestFlightNum,
        customers: ['An','NASA'],
        upcoming: true,
        success: true
    })
    await saveLaunch(newLaunch)
}

const getAllLaunches = async () => {
    return launches.find({},{'_id':0, '__v':0})
}

const checkLaunchIdExist = async (launchId) => {
    return await launches.findOne({flightNumber: launchId})
}

const abortLaunchById = async (launchId) => {
    const abortedLaunch = await launches.updateOne({flightNumber: launchId}, {
        upcoming: false,
        success: false
    })
    return abortedLaunch.modifiedCount === 1
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    checkLaunchIdExist,
    abortLaunchById
}