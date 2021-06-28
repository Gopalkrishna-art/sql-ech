const csv = require('csvtojson');
const {
    matchesFilePath,deliveriesFilePath
  } = require('../ipl/constants.js');

async function fetchData() {
    try{
    const matchesDataPromise = await csv().fromFile(matchesFilePath);
    const deliveriesDataPromise = await csv().fromFile(deliveriesFilePath);
  
     return [matchesDataPromise, deliveriesDataPromise];
    } catch(err){
        console.log(err);
    }
}

module.exports = fetchData;