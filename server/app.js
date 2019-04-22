const Promise = require("bluebird")
const API = require('./util/API')
const jsonfile = require('jsonfile')

const dataPath = './data/data.json'
const dataBuffer = {}

async function getAllContributorsInfo() {
    const Config = jsonfile.readFileSync('./config.json')
    const contributors = Config.contributors

    Promise.mapSeries(contributors, contributor => {
        return Promise.delay(500)
            .then( async () => {
                const organization = Config.organization
                API.getContributorInfo(organization, contributor).then( res => {
                    dataBuffer[`${contributor}`] = res
                    console.log(dataBuffer)
                    jsonfile.writeFile(dataPath, dataBuffer, { spaces: 2 }, (err) => {
                        if (err) console.error(err)
                    })
                })
            }).delay(8000)
    })
}

getAllContributorsInfo()
setInterval(getAllContributorsInfo, 5 * 60 * 1000)