import _sodium from 'libsodium-wrappers';

import { concatBytes, toArrayBuffer } from '@/lib/crypto/helpers';

import { type ModeType } from '@/types';

export async function deriveContentKey(
  mode: ModeType,
  salt: Uint8Array,
  sharedSecrets: Uint8Array[],
) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    toArrayBuffer(concatBytes(sharedSecrets)),
    'HKDF',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: toArrayBuffer(salt),
      info: toArrayBuffer(_sodium.from_string(`nobins:${mode}`)),
    },
    keyMaterial,
    _sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES * 8,
  );

  return new Uint8Array(bits);
}
