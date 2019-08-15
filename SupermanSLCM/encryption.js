const crypto = require('crypto');



module.exports.encrypt = (data, password) => {

    var key = crypto.createCipher('aes-128-cbc', password);
    var string = key.update(data, 'binary', 'binary');
  
    string += key.final('binary');
  
    return string;
  
  }
  
module.exports.decrypt = (data, password) => {
  
    var myKey = crypto.createDecipher('aes-128-cbc', password);
    return myKey.update(data, 'binary', 'binary') + myKey.final('binary');
  
  }