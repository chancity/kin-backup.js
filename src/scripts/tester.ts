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

ToProtectedKeyStore(keyPair, passPhrase)
	.then(p => {
		console.log(p);
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
