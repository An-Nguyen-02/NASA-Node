const launches = new Map()

let latestFlightNum = 100;

const launch = {
    flightNumber: 100,
    mission: 'mission 1',
    launchDate: new Date('December 10, 2030'),
    rocket: 'Space X',
    target: 'Mars',
    customers: ['An', 'NASA'],
    upcoming: true,
    success: true
}

launches.set(launch.flightNumber, launch)

const addNewLaunch = (launch) => {
    latestFlightNum++
    launches.set(latestFlightNum, Object.assign(launch, {
        flightNumber: latestFlightNum,
        customers: ['An','NASA'],
        upcoming: true,
        success: true
    }))
}

const getAllLaunches = () => {
    return Array.from(launches.values())
}

const checkLaunchIdExist = (launchId) => {
    return launches.has(launchId)
}

const abortLaunchById = (launchId) => {
    const abortedLaunch = launches.get(launchId)
    abortedLaunch.upcoming = false;
    abortedLaunch.success = false;
    return abortedLaunch
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    checkLaunchIdExist,
    abortLaunchById
}