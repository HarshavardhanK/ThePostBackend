const crypto = require('crypto');

const database = require("./database");

module.exports.encrypt = (data, password) => {
  //console.log(password)

    var key = crypto.createCipher('aes-128-cbc', password);
    var string = key.update(data, 'binary', 'binary');

    string += key.final('binary');

    return string;

}


module.exports.decrypt = (data, password) => {

  var myKey = crypto.createDecipher('aes-128-cbc', password);
  return myKey.update(data, 'binary', 'binary') + myKey.final('binary');

}

module.exports.decrypt_store = (document) => {

  return this.decrypt(document.data, document.password) 

}

const test = () => {

  let pass = "abc";
  let text = 'hello';

  let encr = this.encrypt(text, pass);

  console.log(encr);

  let decr = this.decrypt(encr, pass);

  console.log(decr);

}

//test();

  