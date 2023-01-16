const axios = require('axios')
const launches = require('./launches.mongoose')
const planets = require('./planets.mongoose')

const DEFAULT_FLIGHT_NUM = 0

const SPACE_X_API = 'https://api.spacexdata.com/v5/launches/query'

const populateSpaceXLaunches = async () => {
    const dataSpaceX =  await axios.post(SPACE_X_API, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    })
    if (dataSpaceX.status !== 200){
        throw new Error('Problem downloading launch data')
    }

    const launchDocs = dataSpaceX.data.docs
    for (const launchDoc of launchDocs){
        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })
        const launch = {
            flight_number: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            launchDate: launchDoc['date_local'],
            customers: customers
        }
        await saveLaunch(launch)
    }

}

const loadLaunchesData = async () => {
    const existSpaceXData = await launches.findOne({
        flightNumber: 198,
        name: "Transporter-6",
        rocket: "Falcon 9"
    })
    if (!existSpaceXData){
        await populateSpaceXLaunches()
    } else {
        console.log('Space X Launches exist')
    }

}

const saveLaunch = async (launch) => {
    await launches.findOneAndUpdate({
        flightNumber : launch.flight_number
    }, launch, {
        upsert: true
    })
}

const getLatestFlightNum = async () => {
    const latestLaunch =  await launches.findOne().sort('-flightNumber')
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUM
    }
    return latestLaunch.flightNumber
}

const addNewLaunch = async (launch) => {
    const planet = await planets.findOne({kepler_name: launch.target})
    if (!planet){
        throw new Error('No matching planet found')
    }
    const latestFlightNum = (await getLatestFlightNum()) + 1
    const newLaunch = Object.assign(launch, {
        flightNumber: latestFlightNum,
        customers: ['An','NASA'],
        upcoming: true,
        success: true
    })
    await saveLaunch(newLaunch)
}

const getAllLaunches = async (skip, limit) => {
    return launches.find({},{'_id':0, '__v':0}).sort({flightNumber: 1}).skip(skip).limit(limit)
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
    abortLaunchById,
    loadLaunchesData
}