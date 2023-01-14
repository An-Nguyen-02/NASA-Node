const {
    getAllLaunches,
    addNewLaunch,
    checkLaunchIdExist,
    abortLaunchById
} = require('../../models/launches.model')

const httpGetAllLaunches = (req, res) => {
    return res.status(200).json(getAllLaunches())
}

const httpAddNewLaunch = (req, res) => {
    const launch = req.body
    if (!launch.launchDate || !launch.mission || !launch.target || !launch.rocket){
        return res.status(400).json({
            error: 'Missing required properties for launch'
        })
    }
    launch.launchDate = new Date(launch.launchDate)
    if (isNaN(launch.launchDate)){
        return res.status(400).json({
            error: 'wrong format date, should be for example: January 20, 2028'
        })
    }
    addNewLaunch(launch)
    return res.status(201).json(launch)
}

const httpDeleteLaunchWithId = (req, res) => {
    const launchId = Number(req.params.id);

    if (!checkLaunchIdExist(launchId)){
        return res.status(404).json({
            error: 'Launch ID not found'
        })
    }
    return res.status(200).json(abortLaunchById(launchId))
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpDeleteLaunchWithId
}