const secp = require('@noble/secp256k1');

// const numOfAccounts = 3;
// const accounts = [];
// for (let i = 0; i < numOfAccounts; i++) {
// generate multiple keys in for loop

// Generate keys/signature offline, copy/paste publicKey to server
(async () => {
    // const privKey = Buffer.from(secp.utils.randomPrivateKey()).toString('hex');
   
    // copy recipient's public key here
    const message = ('transfer 5 to 045a7033ba0d96929b270a6fec5ec3a376263a877b602e46d4fd2fd973acbbc985d5b7ecc109a3aed8054f341106d74430cd9517c4b55cdc6af4e237914fc03f40');
    let messageHash = await secp.utils.sha256(message);
    messageHash = Buffer.from(messageHash).toString('hex');
    // const pubKey = Buffer.from(secp.getPublicKey(privKey)).toString('hex');
    // copy private key here
    privKey = '4790fad883df085cc9a385f04ed7b91b88212ee19434b0e04df61c0c4113acda';
    let signature = await secp.sign(messageHash, privKey);
    signature = Buffer.from(signature).toString('hex');
    // const account = {
    //     privateKey: privKey,
    //     publicKey: pubKey,
    //     msgHash: messageHash,
    //     sig: signature
    //     }
    console.log(messageHash)
    console.log(signature)
})();


// const publicInfo = {};
// for (let i = 0; i < accounts.length; i++) {
//     key = accounts[i].publicKey;
//     publicInfo[key] = accounts[i].balance;
//     }


// console.log("\nAvailable Accounts\n====================");
// for (let i = 0; i < accounts.length; i++) {
//     console.log(`(${i})`, accounts[i].publicKey, `(${accounts[i].balance} ETH)`)
// }
  
// console.log("\nPrivate Keys\n====================");
// for (let i = 0; i < accounts.length; i++) {
//     console.log(`(${i})`, accounts[i].privateKey)
// }

// console.log("\n*** Pass account info to server.js ===> balances = ", publicInfo)

// console.log("\n*** Pass signature to client input field")
