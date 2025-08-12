---
title: "RSA Key Generator – Complete Guide"
lastUpdated: "2025-08-12"
---
# 🔑 RSA Key Generator
Generate, manage, and export RSA key pairs for secure authentication, encryption, and digital signatures. This tool provides flexible key size options, multiple formats, SSH compatibility, and best-practice guidance for developers and security professionals.

---
## ✨ Features
- Generate RSA key pairs with selectable key sizes (1024–4096 bits)
- Choose output format: PEM or DER
- Add passphrase protection to private keys
- SSH public key and fingerprint generation
- Copy, export, and import key pairs
- Save and manage multiple key pairs with custom names
- Security level indicators and best practices
- Tabbed interface for generation, key management, and advanced options
- One-click copy for all key types and fingerprint
- Security best practices sidebar

---
## 🚀 Getting Started

1. **Open the Tool**: Navigate to the RSA Key Generator in your dashboard.
2. **Select "Generate" Tab**: Configure your key options:
   - **Key Size**: Choose from 1024, 2048, 3072, or 4096 bits (2048+ recommended)
   - **Key Format**: Select PEM (default) or DER
   - **Passphrase**: (Optional) Add a passphrase for private key encryption
   - **SSH Key Comment**: Set a comment for your SSH public key
3. **Generate Key Pair**: Click "Generate RSA Key Pair". Wait for the process to complete.
4. **View Keys**: Switch to the "Keys" tab to view, copy, or hide/show your private, public, and SSH keys.
5. **Save/Export/Import**: Save key pairs with a custom name, export as JSON, or import existing key pairs.
6. **Advanced Options**: Use the "Advanced" tab for key usage, expiration, backup, and recovery settings.

> 💡 **Tip:** Use at least 2048 bits for production. Protect your private key with a strong passphrase.

---
## ⚙️ Feature Explanations

| Feature                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| **Key Size**           | Selects the cryptographic strength (1024–4096 bits). Higher = more secure.  |
| **Key Format**         | PEM (Base64, text) or DER (binary). PEM is standard for most applications.  |
| **Passphrase**         | Optional encryption for private key. Strongly recommended for security.     |
| **SSH Key Comment**    | Adds a label to your SSH public key (e.g., user@host).                      |
| **Copy to Clipboard**  | One-click copy for private, public, SSH keys, and fingerprint.              |
| **Export/Import**      | Download/upload key pairs as JSON files for backup or migration.             |
| **Save Key Pair**      | Store generated keys with a custom name for later use.                      |
| **Security Levels**    | Visual indicator of key strength and recommended use cases.                  |
| **Key Fingerprint**    | SHA256 fingerprint for easy key identification.                             |
| **Advanced Options**   | Set key usage (signing/encryption), expiration, backup, and recovery.        |

---
## 🛡️ Security Best Practices

1. **Use Strong Key Sizes**: Minimum 2048 bits for production; 4096 bits for critical systems.
2. **Protect Private Keys**: Always use a strong, unique passphrase.
3. **Store Keys Securely**: Never share private keys. Use encrypted storage.
4. **Rotate Keys Regularly**: Periodically generate new keys and update systems.
5. **Backup Keys Safely**: Keep secure backups in multiple locations.
6. **Limit Key Usage**: Use separate keys for different environments (dev, prod).
7. **Monitor Key Expiration**: Set and track expiration dates for keys.
8. **Never Expose Private Keys**: Do not transmit or log private keys.

---
## 🧪 Examples

### ✅ Generating a Key Pair

**Options:**
- Key Size: 2048 bits
- Format: PEM
- Passphrase: `MyStrongPassphrase!`
- SSH Comment: `alice@server`

**Result:**
- Private Key (PEM, encrypted)
- Public Key (PEM)
- SSH Public Key:  
  ```
  ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ... alice@server
  ```
- Fingerprint:  
  ```
  SHA256:8d2f... (truncated)
  ```

### 🔄 Exporting and Importing Keys

- **Export**: Click "Export" to download a JSON file with your key pair.
- **Import**: Click "Import" and select a previously exported JSON file to restore keys.

### 🔒 Hiding/Showing Keys

- Click the eye icon to toggle visibility of private, public, or SSH keys.

---
## 🛠️ Use Cases

- 🔐 SSH authentication for servers and cloud services
- 🛡️ Secure email (S/MIME), code signing, and document encryption
- 🔑 API and application authentication
- 🗄️ Database and file encryption
- 🧪 Security testing and key management demos
- 🔄 Key rotation and migration projects

---
## 🧰 Troubleshooting Guide

### Key Generation Fails
```
Problem: "Failed to generate RSA key pair"
Solution: Ensure valid key size and format. Try a different browser or clear cache.
```
### Invalid Key Size
```
Problem: "Invalid key size selected"
Solution: Choose 1024, 2048, 3072, or 4096 bits only.
```
### Import Fails
```
Problem: "Failed to import key pair"
Solution: Ensure the JSON file contains valid privateKey, publicKey, and keySize fields.
```
### Private Key Not Visible
```
Problem: Private key is hidden
Solution: Click the eye icon to reveal. For security, keep it hidden unless needed.
```
### Export/Download Not Working
```
Problem: Nothing happens when clicking "Export"
Solution: Check browser download permissions and try again.
```
### Passphrase Forgotten
```
Problem: Cannot decrypt private key
Solution: There is no recovery for lost passphrases. Generate a new key pair.
```

---
## 📊 Security Levels

| Level      | Min Key Size | Use Case                        | Color      |
|------------|--------------|----------------------------------|------------|
| Basic      | 1024         | Development/testing only         | Blue       |
| Standard   | 2048         | Most production applications     | Green      |
| High       | 3072         | Sensitive/regulated environments | Yellow     |
| Maximum    | 4096         | Critical/long-term security      | Red        |

---
## 🔧 Code Examples

### JavaScript (Node.js)
```javascript
const { generateKeyPairSync } = require('crypto');
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem', cipher: 'aes-256-cbc', passphrase: 'MyStrongPassphrase!' }
});
console.log('Private Key:', privateKey);
console.log('Public Key:', publicKey);
```

### Python
```python
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
pem = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.BestAvailableEncryption(b'MyStrongPassphrase!')
)
print(pem.decode())
```

### OpenSSL CLI
```sh
# Generate private key (PEM, 2048 bits, encrypted)
openssl genpkey -algorithm RSA -out private.pem -aes256 -pkeyopt rsa_keygen_bits:2048
# Extract public key
openssl rsa -pubout -in private.pem -out public.pem
# Generate SSH public key
ssh-keygen -y -f private.pem > id_rsa.pub
```

---
## 🔐 Technical Details

- **Algorithm**: RSA (Rivest–Shamir–Adleman)
- **Key Sizes**: 1024, 2048, 3072, 4096 bits
- **Formats**: PEM (Base64, text), DER (binary)
- **SSH Format**: OpenSSH-compatible public key
- **Fingerprint**: SHA256 hash of public key

---
## 🔗 Related Tools

* [Bcrypt Generator](/dashboard/tools/bcrypt-generator)
* [Hash Generator](/dashboard/tools/hash-generator)
* [JWT Encoder Decoder](/dashboard/tools/jwt)
* [Token Generator](/dashboard/tools/token-generator)
* [HMAC Generator](/dashboard/tools/hmac-generator)

---
## 📚 Learn More

* [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
* [Wikipedia: RSA (cryptosystem)](https://en.wikipedia.org/wiki/RSA_(cryptosystem))
* [OpenSSH Key Management](https://www.ssh.com/academy/ssh/keygen)
* [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)
* [Python cryptography Documentation](https://cryptography.io/en/latest/)

---
> 🧠 **Pro Tip:** Always use a strong passphrase and store your private key in a secure, encrypted location. For production, use at least 2048 bits and rotate