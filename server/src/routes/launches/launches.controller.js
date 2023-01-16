const {
    getAllLaunches,
    addNewLaunch,
    checkLaunchIdExist,
    abortLaunchById
} = require('../../models/launches.model')

const httpGetAllLaunches = async (req, res) => {
    return res.status(200).json(await getAllLaunches())
}

const httpAddNewLaunch = async (req, res) => {
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
    await addNewLaunch(launch)
    return res.status(201).json(launch)
}

const httpDeleteLaunchWithId = async (req, res) => {
    const launchId = Number(req.params.id);
    const launchExist = await checkLaunchIdExist(launchId)
    if (!launchExist){
        return res.status(404).json({
            error: 'Launch ID not found'
        })
    }
    const aborted = await abortLaunchById(launchId)
    if (!aborted){
        return res.status(400).json({error: 'Launch abort error'})
    }
    return res.status(200).json({ok: true})
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpDeleteLaunchWithId
}