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

const fileName =  "new_test_backup.png";
const passPhrase = "passphrase";
const keyPair = Keypair.random();
const expectedPublicKey = keyPair.publicKey();

ToProtectedKeyStore(keyPair, passPhrase)
	.then(p => {
		console.log(p);
		console.log("Encrpyted keystore.")
		return Encode(p);
	})
	.then(buffer => {
		fs.writeFile(fileName, buffer, "binary", function(err) {
			if (err) { throw err; }
			console.log("File saved.");
		})
		return Decode(buffer);
	})
	.then(p => {
		return ToUnprotectedKeyStore(passPhrase, p.salt, p.seed);
	})
	.then(up => console.log(up)).then(() =>{
		fs.readFile(fileName, function(err, buffer) {
			if (err) {
				throw err;
			}
			Decode(buffer).then(p => {
				return ToUnprotectedKeyStore(passPhrase, p.salt, p.seed);
			})
				.then(up => {
					console.log(up);
					const expectedKey = up.pkey === expectedPublicKey;
					console.log("Got expected public key " + expectedKey + ".");
				});
		});
	});

```

## Tester output
```
ProtectedKeyStore {
  pkey: 'GBNPYAEZYUEDLKHX33WXZTBI7JAMQMWADV3VWPWXVXEZES4CSFR52TMI',
  salt: '6ea4fd8b6791f4c70a9b2df8c3234721',
  seed: '55d0a8d6a021f4996b7455d3c53d7de9edfa202a7b9855950c7c9dcfbd94357d709d46896e7083570237d766a5cd6de9e6ade4e5a9ea90ddf99ccdf2985e75b3e7aba7e37b6748ce' }
Encrpyted keystore.
UnprotectedKeyStore {
  pkey: 'GBNPYAEZYUEDLKHX33WXZTBI7JAMQMWADV3VWPWXVXEZES4CSFR52TMI',
  seed: 'SDGMZOYWCHL2KNESGIKSFW2O3SSAAN72VY43U7WUOW6ORWENUAAPQMPB' }
File saved.
UnprotectedKeyStore {
  pkey: 'GBNPYAEZYUEDLKHX33WXZTBI7JAMQMWADV3VWPWXVXEZES4CSFR52TMI',
  seed: 'SDGMZOYWCHL2KNESGIKSFW2O3SSAAN72VY43U7WUOW6ORWENUAAPQMPB' }
Got expected public key true.
```
