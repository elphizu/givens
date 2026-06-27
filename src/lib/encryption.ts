import _sodium from 'libsodium-wrappers';
import { ml_kem1024 } from '@noble/post-quantum/ml-kem.js';

import { encodeBytes, encodeJson } from '@/lib/crypto/helpers';
import { deriveContentKey } from '@/lib/crypto/hkdf';

import type {
  PastePayload,
  EncryptedPaste,
  PasteEnvelope,
  PasteEnvelopeSecret,
} from '@/lib/crypto/types';

export async function encryptPasteContent({
  content,
  mode,
}: PastePayload): Promise<EncryptedPaste> {
  await _sodium.ready;
  const sodium = _sodium;

  /**
   * We generate both sides of the X25519 exchange.
   *
   * The envelope stores the sender ephemeral public key.
   * The URL secret stores the recipient secret key.
   *
   * During decrypt, the recipient secret key and sender ephemeral public key
   * recompute the same shared secret.
   */
  const recipientSecretKey = sodium.randombytes_buf(sodium.crypto_scalarmult_SCALARBYTES);
  const senderEphemeralSecretKey = sodium.randombytes_buf(sodium.crypto_scalarmult_SCALARBYTES);

  const recipientPublicKey = sodium.crypto_scalarmult_base(recipientSecretKey);
  const senderEphemeralPublicKey = sodium.crypto_scalarmult_base(senderEphemeralSecretKey);

  const x25519SharedSecret = sodium.crypto_scalarmult(senderEphemeralSecretKey, recipientPublicKey);

  const sharedSecrets: Uint8Array[] = [x25519SharedSecret];

  const secret: PasteEnvelopeSecret = {
    version: 1,
    mode,
    x25519SecretKey: encodeBytes(recipientSecretKey),
  };

  const envelope: Omit<PasteEnvelope, 'salt' | 'nonce' | 'ciphertext'> = {
    version: 1,
    mode,
    x25519EphemeralPublicKey: encodeBytes(senderEphemeralPublicKey),
  };

  if (mode === 'sealed') {
    /**
     * In sealed mode, the envelope stores the ML-KEM ciphertext,
     * while the URL secret stores the ML-KEM secret key.
     *
     * Both are required to recover the additional KEM shared secret.
     */
    const mlKemKeyPair = ml_kem1024.keygen();
    const encapsulated = ml_kem1024.encapsulate(mlKemKeyPair.publicKey);

    sharedSecrets.push(encapsulated.sharedSecret);

    secret.mlKemSecretKey = encodeBytes(mlKemKeyPair.secretKey);
    envelope.mlKemCiphertext = encodeBytes(encapsulated.cipherText);
  }

  const salt = sodium.randombytes_buf(32);

  const nonce = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_IETF_NPUBBYTES);

  const contentKey = await deriveContentKey(mode, salt, sharedSecrets);

  const associatedData = sodium.from_string(`nobins:${mode}`);
  const plaintext = sodium.from_string(content);

  const encryptedContent = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
    plaintext,
    associatedData,
    null,
    nonce,
    contentKey,
  );

  const pasteEnvelope = {
    ...envelope,
    salt: encodeBytes(salt),
    nonce: encodeBytes(nonce),
    ciphertext: encodeBytes(encryptedContent),
  } satisfies PasteEnvelope;

  return {
    ciphertext: JSON.stringify(pasteEnvelope),
    key: encodeJson(secret),
  };
}
