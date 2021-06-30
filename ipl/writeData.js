const fs = require("fs");
function writeData(path, result) {
    try {
      const string1 = JSON.stringify(result, null, 4);
      fs.writeFile(path, string1, function (err) {
        if (err) throw err;
        console.log('Completed');
      });
    } catch (err) {
      console.log(err);
    }
  }
  module.exports=writeData;
