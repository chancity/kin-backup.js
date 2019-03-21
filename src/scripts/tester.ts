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
