---
title: "HMAC Generator – Complete Guide"
lastUpdated: "2025-08-02"
---

# 🔒 HMAC Generator

Generate secure Hash-based Message Authentication Codes (HMAC) for API authentication, data integrity verification, and webhook security. Features multiple hash algorithms, encoding options, and security best practices.

## ✨ Features

- Multiple hash algorithm support (SHA-1, SHA-256, SHA-384, SHA-512)
- Various output encodings (Hex, Base64, Binary)
- Nonce and timestamp generation
- Example payloads for common use cases
- Real-time HMAC generation
- Copy-ready cURL commands

---

## 🚀 Quick Start

1. **Enter Message**: Input the data you want to sign
2. **Set Secret Key**: Enter your HMAC secret key
3. **Choose Algorithm**: Select from available hash algorithms (SHA-256 recommended)
4. **Select Encoding**: Choose output format (Hex/Base64/Binary)
5. **Generate & Copy**: Get your HMAC signature

> 💡 Tip: Use the timestamp and nonce options to prevent replay attacks in your applications.

---

## ⚙️ Configuration Options

| Option | Description | Recommended |
|--------|-------------|-------------|
| Algorithm | Hash algorithm for HMAC | SHA-256 |
| Secret Key | Private key for signing | Strong random string |
| Encoding | Output format | Hex for readability |
| Timestamp | Message timestamp | Current ISO time |
| Nonce | Unique request ID | Random string |

---

## 🛠️ Use Cases

- 🔐 API Authentication
- 📡 Webhook Signatures
- ✅ Data Integrity Verification
- 🔄 Request Validation
- 📨 Message Authentication

---

## 🧪 Examples

### ✅ Webhook Payload

```json
{
  "message": {"event":"user.created","data":{"id":123,"email":"user@example.com"}},
  "secret": "your-secret-key",
  "algorithm": "SHA-256",
  "encoding": "hex"
}
```

### 🔐 API Request

```json
{
  "message": "GET /api/users HTTP/1.1\nHost: example.com\nX-Request-ID: abc123",
  "secret": "api-secret-key",
  "algorithm": "SHA-256",
  "encoding": "base64"
}
```

---

## 🧷 Security Best Practices

1. **Secret Key Management**
   - Use strong, random secret keys
   - Never expose keys in client-side code
   - Rotate keys periodically
   - Use different keys per environment

2. **Algorithm Selection**
   - Prefer SHA-256 or stronger
   - Avoid deprecated SHA-1
   - Consider future algorithm upgrades

3. **Implementation**
   - Include timestamps to prevent replay attacks
   - Add nonce for request uniqueness
   - Validate HMAC server-side
   - Use constant-time comparison

---

## 📊 Best Practices

1. **Message Preparation**
   - Normalize message content
   - Use consistent character encoding
   - Consider message canonicalization
   - Handle special characters

2. **Key Management**
   - Secure key storage
   - Regular key rotation
   - Key length matching hash size
   - Environment separation

3. **Validation Process**
   - Timestamp verification
   - Nonce uniqueness check
   - Algorithm verification
   - Proper error handling

---

## 🔗 Related Tools

* [Hash Generator](/dashboard/tools/hash-generator)
* [JWT Encoder Decoder](/dashboard/tools/jwt)
* [Base64 Encoder](/dashboard/tools/base64)
* [Token Generator](/dashboard/tools/token-generator)

---

## 📚 Learn More

* [HMAC Specification (RFC 2104)](https://tools.ietf.org/html/rfc2104)
* [HMAC on MDN](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign#HMAC)
* [Webhook Security Best Practices](https://webhooks.fyi/security/hmac)

---

> 🧠 **Pro Tip**: Always include both timestamp and nonce in your HMAC calculations to prevent replay attacks and ensure request uniqueness!