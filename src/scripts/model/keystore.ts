export interface  KeyStore {
	readonly pkey: string;
	readonly seed: string;
}
export interface PKeyStore extends KeyStore {
	readonly salt: string;
}
export class ProtectedKeyStore implements PKeyStore {
	public readonly pkey: string;
	public readonly salt: string;
	public readonly seed: string;
	public constructor(publicKey: string, salt: string, seed: string) {
		this.pkey = publicKey;
		this.salt = salt;
		this.seed = seed;
	}
}
export class UnprotectedKeyStore implements KeyStore {
	public readonly pkey: string;
	public readonly seed: string;
	public constructor(publicKey: string, seed: string) {
		this.pkey = publicKey;
		this.seed = seed;
	}
}
