import * as Crypto from 'expo-crypto';

export async function calculateSha256(payload: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, payload);
}
