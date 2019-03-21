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
