import _sodium from "libsodium-wrappers-sumo";
import { Keypair } from "@kinecosystem/kin-sdk";
import { ProtectedKeyStore, UnprotectedKeyStore } from "./model/keystore";

let sodium: typeof _sodium;

const ARGON_SALT_BYTES = 16;
const KEY_BYTES = 32;
const ARGON_OPSLIMIT_INTERACTIVE  = 2;
const ARGON_MEMLIMIT_INTERACTIVE  = 67108864;
const ARGON_ALGORITHM_DEFAULT  = 2;

async function initSodium() {
	await _sodium.ready;
	sodium = _sodium;
}
export async function ToUnprotectedKeyStore(passPhrase: string, saltHex: string, seedHex: string): Promise<UnprotectedKeyStore> {
	await initSodium();
	const passPhraseBytes = sodium.from_string(passPhrase);
	const saltBytes = sodium.from_hex(saltHex);
	const seedBytes = sodium.from_hex(seedHex);
	const keyHashBytes = keyHash(passPhraseBytes, saltBytes);
	const decryptedSeedBytes = decryptSecretSeed(seedBytes, keyHashBytes);
	const keyPair = Keypair.fromRawEd25519Seed(decryptedSeedBytes) as Keypair;
	return new UnprotectedKeyStore(keyPair.publicKey(), keyPair.secret());
}
export async function ToProtectedKeyStore(keyPair: Keypair, passPhrase: string): Promise<ProtectedKeyStore> {
	await initSodium();
	const saltBytes = sodium.randombytes_buf(ARGON_SALT_BYTES);
	const passPhraseBytes = sodium.from_string(passPhrase);
	const keyHashBytes = keyHash(passPhraseBytes, saltBytes);
	const encryptedSeedBytes = encryptSecretSeed(keyPair.rawSecretKey(), keyHashBytes);
	return new ProtectedKeyStore(keyPair.publicKey(), sodium.to_hex(saltBytes), sodium.to_hex(encryptedSeedBytes));
}
function decryptSecretSeed(nonce_and_ciphertext: Uint8Array, keyHashBytes: Uint8Array): Uint8Array {
	if (nonce_and_ciphertext.length < sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES) {
		throw new Error("Short message");
	}
	const nonce = nonce_and_ciphertext.slice(0, sodium.crypto_secretbox_NONCEBYTES);
	const cipherText = nonce_and_ciphertext.slice(sodium.crypto_secretbox_NONCEBYTES);
	const decryptedSeedBytes = sodium.crypto_secretbox_open_easy(cipherText, nonce, keyHashBytes);
	return decryptedSeedBytes.slice(0, KEY_BYTES);
}
function encryptSecretSeed(seedBytes: Uint8Array, keyHashBytes: Uint8Array): Uint8Array {
	const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
	const encrypted = sodium.crypto_secretbox_easy(seedBytes, nonce, keyHashBytes);
	return mergeTypedArraysUnsafe(nonce, encrypted);
}
function mergeTypedArraysUnsafe(a: any, b: any) {
	const c = new a.constructor(a.length + b.length);
	c.set(a);
	c.set(b, a.length);
	return c;
}
function keyHash(passPhrase: Uint8Array, salt: Uint8Array): Uint8Array {
	return sodium.crypto_pwhash(KEY_BYTES, passPhrase, salt, ARGON_OPSLIMIT_INTERACTIVE, ARGON_MEMLIMIT_INTERACTIVE, ARGON_ALGORITHM_DEFAULT );
}
