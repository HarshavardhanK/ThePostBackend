
const crypto = require('crypto');


const encrypt = function(data) {

  var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
  var mystr = mykey.update(data, 'utf8', 'hex');
  mystr += mykey.final('hex');

  return mystr;

};

const decrypt = function(data) {
  var myKey = crypto.createDecipher('aes-128-cbc', 'mypassword');
  return myKey.update(data, 'hex', 'utf8') + myKey.final('utf8');
};

//console.log(encrypt('hello'));
console.log(decrypt(encrypt("fuck you")));
