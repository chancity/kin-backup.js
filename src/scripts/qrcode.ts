// @ts-ignore
import QrcodeDecoder from "qr-decode/server";
import QrCodeEncoder from "qrcode";
import { KeyStore, ProtectedKeyStore } from "./model/keystore";

export async function Encode(keyStore: KeyStore): Promise<Buffer> {
	const img = await QrCodeEncoder.toDataURL(JSON.stringify(keyStore));
	return new Buffer(img.split(",")[1], "base64");
}

export async function Decode(keyStoreImgBuffer: Buffer): Promise<ProtectedKeyStore> {
	return JSON.parse(await QrcodeDecoder.decodeByBuffer(keyStoreImgBuffer)) as ProtectedKeyStore;
}
