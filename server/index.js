const express = require('express');
const app = express();
const cors = require('cors');
const secp = require('@noble/secp256k1');
const SHA256 = require("crypto-js/sha256");
const port = 3042;

app.use(cors());
app.use(express.json());

const numOfAccounts = 10;
const privateKeys = [];

console.log("\nPrivate Keys\n====================");
for (let i = 0; i < numOfAccounts + 1; i++) {
  const privateKey = Buffer.from(secp.utils.randomPrivateKey()).toString('hex'); 
  privateKeys.push(privateKey);
  console.log(`(${i})`, privateKeys[i]);
}

console.log("\nAvailable Accounts\n====================");
const balances = {}
for (let i = 0; i < privateKeys.length; i ++) {
  const publicKey = Buffer.from(secp.getPublicKey(privateKeys[i])).toString('hex');
  balances[publicKey] = 100;
  console.log(`(${i})`, publicKey, `(${balances[publicKey]} ETH)`);
}


app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { sender, recipient, amount, signature } = req.body;
  (async () => {
    let messageHash = await secp.utils.sha256(JSON.stringify({amount, recipient}));
    messageHash = Buffer.from(messageHash).toString('hex');
    let recoveredPublicKey = secp.recoverPublicKey(messageHash, signature, 1);
    recoveredPublicKey = Buffer.from(recoveredPublicKey).toString('hex');

    console.log(messageHash)
    console.log(recoveredPublicKey) 
  
    if (secp.verify(signature, messageHash, recoveredPublicKey)) {
      console.log("success!");
      balances[sender] -= amount;
      balances[recipient] = (balances[recipient] || 0) + +amount;
      res.send({ balance: balances[sender] });
    } else {
      console.log('Check your inputs and try again.')
    }
  })();
});

app.listen(port, () => {
  console.log(`\nListening on port ${port}!`);
});