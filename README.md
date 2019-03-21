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

const expectedPublicKey: string = "GBM6GP3FDOU2T2XLFYVWBS4NJIOFBA7HEQ6BXIXCDDKZUFEZRYGU6TL5";
const passPhrase = "passphrase";
const keyPair = Keypair.random();
let protectedKeyStore: ProtectedKeyStore;

ToProtectedKeyStore(keyPair, passPhrase)
	.then(p => {
		protectedKeyStore = p;
		console.log(protectedKeyStore);
		return Encode(p);
	})
	.then(buffer => {
		return Decode(buffer);
	})
	.then(p => {
		return ToUnprotectedKeyStore("passphrase", p.salt, p.seed);
	})
	.then(up => console.log(up));

fs.readFile("test_backup.png", function(err, buffer) {
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
```

## Tester output
```
ProtectedKeyStore {
  pkey: 'GA77HHXFXYQNO5Z6O7DH67ESMJLRQWLEEFS4QWMROYQPKGAM62HUSRDG',
  salt: 'e809d0eb35c5c27eb2986d53fe49784b',
  seed: '1d40cc77b1c4a07ed35725a9fbf9215b23067e16b8ee492235c32b3d7551b2c4eb811b80da43a50b3c966f28dfbbdac96ea7b11f5a7ccd4229b38271aedd238aa7bb2797f9e2d547' }
UnprotectedKeyStore {
  pkey: 'GA77HHXFXYQNO5Z6O7DH67ESMJLRQWLEEFS4QWMROYQPKGAM62HUSRDG',
  seed: 'SC4DUCZFADKGHKQYP5GJZ7XNT7TIQWWNY2WKYG7VRFZMO7VK24T7O4MI' }
UnprotectedKeyStore {
  pkey: 'GBM6GP3FDOU2T2XLFYVWBS4NJIOFBA7HEQ6BXIXCDDKZUFEZRYGU6TL5',
  seed: 'SDFFWNJ3KUSKB5AY7DGNYWIUVUWCPMCFDBF7USUTN7VXGABWQKJPPAOB' }
got expected public key true
```
