import _sodium from 'libsodium-wrappers';
import { ml_kem1024 } from '@noble/post-quantum/ml-kem.js';

import { deriveContentKey } from '@/lib/crypto/hkdf';
import { decodeBytes, decodeJson } from '@/lib/crypto/helpers';
import { PasteEnvelopeSchema, PasteEnvelopeSecretSchema } from '@/lib/crypto/validation';

import type { EncryptedPaste, PastePayload } from '@/lib/crypto/types';

export async function decryptPasteContent({
  ciphertext,
  key,
}: EncryptedPaste): Promise<PastePayload> {
  await _sodium.ready;

  const sodium = _sodium;
  const envelope = PasteEnvelopeSchema.parse(JSON.parse(ciphertext));
  const secret = PasteEnvelopeSecretSchema.parse(decodeJson(key));

  if (envelope.mode !== secret.mode) {
    throw new Error('Paste key does not match envelope mode');
  }

  const sharedSecrets = [
    sodium.crypto_scalarmult(
      decodeBytes(secret.x25519SecretKey),
      decodeBytes(envelope.x25519EphemeralPublicKey),
    ),
  ];

  if (envelope.mode === 'sealed') {
    if (!envelope.mlKemCiphertext || !secret.mlKemSecretKey) {
      throw new Error('Missing ML-KEM envelope material');
    }

    sharedSecrets.push(
      ml_kem1024.decapsulate(
        decodeBytes(envelope.mlKemCiphertext),
        decodeBytes(secret.mlKemSecretKey),
      ),
    );
  }

  const contentKey = await deriveContentKey(
    envelope.mode,
    decodeBytes(envelope.salt),
    sharedSecrets,
  );
  const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
    null,
    decodeBytes(envelope.ciphertext),
    sodium.from_string(`nobins:${envelope.mode}`),
    decodeBytes(envelope.nonce),
    contentKey,
  );

  return {
    content: sodium.to_string(plaintext),
    mode: envelope.mode,
  };
}
