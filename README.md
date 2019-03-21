# kin-backup.js

## Usage
```
import {
	ToProtectedKeyStore,
	ToUnprotectedKeyStore,
	ProtectedKeyStore,
	Keypair,
	Encode,
	Decode
	} from "./index";

import * as fs from "fs";

const passPhrase = "passphrase";
const keyPair = Keypair.random();
const expectedPublicKey: string = keyPair.publicKey();

ToProtectedKeyStore(keyPair, passPhrase)
	.then(p => {
		console.log(p);
		return Encode(p);
	})
	.then(buffer => {
		fs.writeFile("new_test_backup.png", buffer, "binary", function(err) {
			if (err) { throw err; }
			console.log("File saved.");
		})
		return Decode(buffer);
	})
	.then(p => {
		return ToUnprotectedKeyStore("passphrase", p.salt, p.seed);
	})
	.then(up => console.log(up)).then(() =>{
		fs.readFile("new_test_backup.png", function(err, buffer) {
			if (err) {
				throw err;
			}
			Decode(buffer).then(p => {
				return ToUnprotectedKeyStore(passPhrase, p.salt, p.seed);
			})
				.then(up => {
					console.log(up);
					const expectedKey = up.pkey === expectedPublicKey;
					console.log("got expected public key " + expectedKey);
				});
		});
	});
```

## Tester output
```
ProtectedKeyStore {
  pkey: 'GCDUY6JKXRYRQPVGHQ25N4JVIEQQZXEC5LTEMCN7I7DCFXMZSUDR3VFQ',
  salt: 'd09fbc280de4ebb4d3fd4db422838aa1',
  seed: 'a3db3a0ae3bf6a62fe28ab4b9c7a00863f328108f5ec877e3bb05bf3581b1f02815c9384af76bdfaf687e98fe2b91cfb938fc9a545ef8921132742e9648157e5244a3bf7823569ca' }
UnprotectedKeyStore {
  pkey: 'GCDUY6JKXRYRQPVGHQ25N4JVIEQQZXEC5LTEMCN7I7DCFXMZSUDR3VFQ',
  seed: 'SDI5YRRBRJNHDO35ETUGEALCXKZHBZK6JJGMSR57QUNDIGTRKZOIRLV5' }
File saved.
UnprotectedKeyStore {
  pkey: 'GCDUY6JKXRYRQPVGHQ25N4JVIEQQZXEC5LTEMCN7I7DCFXMZSUDR3VFQ',
  seed: 'SDI5YRRBRJNHDO35ETUGEALCXKZHBZK6JJGMSR57QUNDIGTRKZOIRLV5' }
got expected public key true

```
