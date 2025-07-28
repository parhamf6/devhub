---
title: "JWT Decoder & Encoder Guide"
lastUpdated: "2025-07-28"
---

# JWT Decoder & Encoder
A tool to decode, inspect, and encode JSON Web Tokens (JWTs) easily without manual base64 decoding or worrying about token structure.

## 🚀 Quick Start
> Tip: Paste any JWT string to instantly view its decoded header, payload, and signature. You can also build your own token by providing header and payload JSON and a secret.

### Steps
1. **Paste or Input JWT**: Paste your existing JWT string into the decoder area.
2. **View Decoded Output**: The tool will automatically decode and syntax-highlight the header and payload as JSON, along with the signature.
3. **Check Validity**: Expiration and issuer validation warnings will be shown if applicable.
4. **Encode JWT**: Switch to the encoder section to create a new JWT by entering header, payload, and secret, then generate a token.
5. **Copy or Use**: Copy the decoded data or the newly generated JWT string for your workflow.

## ⚙️ Options

| Option         | Description                                    | Default            |
|----------------|------------------------------------------------|--------------------|
| JWT Input      | Paste your JWT string here                      | (empty)            |
| Show Signature | Toggle visibility of the signature section     | true               |
| Secret Key     | Secret for encoding JWT (HMAC SHA256)          | (empty)            |
| Header JSON    | JSON object for JWT header                       | `{ "alg": "HS256", "typ": "JWT" }` |
| Payload JSON   | JSON object for JWT payload                      | `{}`               |

## 📦 Output Format

- **Decoded JWT**: JSON-formatted header and payload objects, plus base64-encoded signature string.
- **Encoded JWT**: Three parts concatenated with dots: `base64url(header).base64url(payload).signature`
- Warnings shown inline if token is expired or malformed.


## 💡 Use Cases

* Quickly inspect JWTs received from authentication flows or APIs.
* Debug and verify token claims like expiration (`exp`) and issuer (`iss`).
* Generate custom JWTs for testing or prototyping authentication.
* Learn the structure of JWTs by visualizing their parts clearly.

## 🔒 Security Notes

* This tool **does not** verify signatures cryptographically unless you supply the secret in the encoder.
* Never share secrets or private keys in public or untrusted environments.
* JWTs created here are for development/testing only — use secure libraries and practices in production.
* Do **not** rely solely on expiration or issuer claims for security without verifying signature validity.


## 🔧 Code Examples

### JavaScript (Decoding JWT manually)

```js
function base64UrlDecode(str) {
  // Replace URL-safe chars, pad with '='
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

function decodeJWT(token) {
  const [headerB64, payloadB64, signature] = token.split('.');
  const header = JSON.parse(base64UrlDecode(headerB64));
  const payload = JSON.parse(base64UrlDecode(payloadB64));
  return { header, payload, signature };
}
````

### JavaScript (Encoding JWT with HMAC SHA256)

```js
import crypto from 'crypto';

function base64UrlEncode(obj) {
  const str = JSON.stringify(obj);
  return Buffer.from(str).toString('base64url');
}

function sign(data, secret) {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

function encodeJWT(header, payload, secret) {
  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const signature = sign(`${encodedHeader}.${encodedPayload}`, secret);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
```

---
