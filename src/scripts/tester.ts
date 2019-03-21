import { Encode, Decode } from "./qrcode";
import { ToProtectedKeyStore, ToUnprotectedKeyStore } from "./crypto";
import { Keypair } from "@kinecosystem/kin-sdk";
import { ProtectedKeyStore } from "./model/keystore";
import * as fs from "fs";

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

const expectedPublicKey: string = "GBM6GP3FDOU2T2XLFYVWBS4NJIOFBA7HEQ6BXIXCDDKZUFEZRYGU6TL5";
fs.readFile("test_backup.png", function(err, buffer) {
	if (err) {
		throw err;
	}
	Decode(buffer).then(p => {
		return ToUnprotectedKeyStore("passphrase", p.salt, p.seed);
	})
	.then(up => {
		console.log(up);
		const expectedKey = up.pkey === expectedPublicKey;
		console.log("got expected public key " + expectedKey);
	});
});
