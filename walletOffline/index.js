const secp = require('@noble/secp256k1');

// replace address, amount, and sender's private key
const recipient = "040a91c76cfe114bc4d76f4098dfb5db4dca39f52769173c0a7804703c7e44b645cc36d1d5e3cd0b476e5b7c34276503e13ac983fad0babb2e28ccba9643c7cd90";
const amount = "5";
const privateKey = "d73cb6559cf3231247d7880bddc559ea30547b2e7881853c01388bcbe877331f";

(async () => {
   
    let messageHash = await secp.utils.sha256(JSON.stringify({"amount": amount, "recipient": recipient}));
    messageHash = Buffer.from(messageHash).toString('hex');

  
    let signature = await secp.sign(messageHash, privateKey);
    signature = Buffer.from(signature).toString('hex');
          
    console.log(messageHash)
    console.log(signature)

})();

