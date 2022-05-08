const express = require('express');
const app = express();
const cors = require('cors');
const secp = require('@noble/secp256k1');
const SHA256 = require("crypto-js/sha256");
const port = 3042;
// const publicAccounts = require('./walletOffline.js')
// import {publicAccounts} from './walletOffline.js';

app.use(cors());
app.use(express.json());

const numOfAccounts = 10;
const accounts = [];

for (let i = 0; i < numOfAccounts + 1; i++) {
  const privKey = Buffer.from(secp.utils.randomPrivateKey()).toString('hex');
  const pubKey = Buffer.from(secp.getPublicKey(privKey)).toString('hex');
  accounts.push({
    privateKey: privKey,
    publicKey: pubKey,
    balance: 100,
  })
}
// add publicKey from wallet here
// accounts.push({
//   privateKey: 'XXXXXXX',
//   publicKey: '045d60269a527ef65f8d8b5a6e2554b06afaefd3a41189f24ee47e2d8d2c3b003f9a262f6121cc858a26488fe4a26d9bf49c37e879e88fe5ec139f24e14a29b69a',
//   balance : 100,
// })

const balances = {}
for (let i = 0; i < accounts.length; i ++) {
  balances[accounts[i].publicKey] = 100;
}


app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { sender, recipient, amount, signature } = req.body;
 
  const msgHash = SHA256(JSON.stringify({ recipient, amount })).toString();
  const recoveredPublicKey = secp.recoverPublicKey(messageHash, signature, 1);
  
  // console.log(msgHash)
  // console.log(recoveredPublicKey)
  
  if (secp.verify(signature, msgHash, recoveredPublicKey)) {
    balances[sender] -= amount;
    balances[recipient] = (balances[recipient] || 0) + +amount;
    res.send({ balance: balances[sender] });
  } else {
    console.log('Check those inputs again...')
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  console.log("\nAvailable Accounts\n====================");
  for (let i = 0; i < accounts.length; i++) {
    console.log(`(${i})`, accounts[i].publicKey, `(${accounts[i].balance} ETH)`)
  }

  console.log("\nPrivate Keys\n====================");
  for (let i = 0; i < accounts.length; i++) {
    console.log(`(${i})`, accounts[i].privateKey)
  }
});