---
title: "UUID Generator – Complete Guide"
lastUpdated: "2025-07-27"
---

# 🆔 UUID Generator

Generate **universally unique identifiers (UUIDs)** for your applications, databases, APIs, and more. Supports version 1 (timestamp-based) and version 4 (random) UUIDs, with optional customization.

---

## ✨ Features

- Generate UUIDs v1 (timestamp-based) and v4 (random-based)
- Toggle uppercase output
- Remove hyphens for compact formats
- Auto-regenerate on changes
- One-click copy
- Works offline and on mobile

---

## 🚀 Quick Start

> **Tip:** Use UUID v4 for general-purpose random IDs. Use UUID v1 if you need timestamp encoding.

1. **Select Version**: Choose v1 (timestamp) or v4 (random)
2. **Enable Customization**:
   - Uppercase toggle
   - Remove hyphens
3. **Copy to Clipboard**: Use the copy icon for quick use

---

## 🧠 What Is a UUID?

A **UUID** (Universally Unique Identifier) is a 128-bit number used to uniquely identify information in computer systems. UUIDs are standardized in [RFC 4122](https://datatracker.ietf.org/doc/html/rfc4122).

### Types Supported

| Version | Description                      | Format        |
|---------|----------------------------------|---------------|
| v1      | Timestamp + MAC address (less private) | Time-based |
| v4      | Cryptographically secure random | Random        |

---

## ⚙️ Configuration Options

| Option        | Description                           | Default |
|---------------|---------------------------------------|---------|
| Version       | UUID version (v1 or v4)               | `v4`    |
| Uppercase     | Convert output to uppercase           | ❌      |
| Remove Hyphens| Strip out `-` characters              | ❌      |

---

## 🛠️ Use Cases

- 🔑 API key generation
- 🗂️ Unique database row IDs (No collision risk)
- 🧪 Test data seeding
- 📦 Transaction or request tracking
- 🔄 Distributed system uniqueness

---

## 🧪 Examples

### 🎲 Default v4 UUID

```

f64f9fa0-3a8e-4ff0-a15c-5c9fc3f4c3e7

```

### 🔢 v1 UUID (with timestamp)

```

1b4e28ba-2fa1-11d2-883f-0016d3cca427

```

### 🔤 Uppercase & No Hyphens

```

CDEF345E68A84726BE7840E124F0B1A6

````

---

## 🔧 Code Examples

### JavaScript (v4 with `uuid` package)

```javascript
import { v4 as uuidv4, v1 as uuidv1 } from 'uuid';

console.log(uuidv4()); // Random UUID
console.log(uuidv1()); // Timestamp-based UUID
````

### Python

```python
import uuid

print(uuid.uuid4())  # Random
print(uuid.uuid1())  # Timestamp + MAC
```

### Bash (Linux/macOS)

```bash
# Install uuid-runtime package if not available
uuidgen           # Default (v4)
uuidgen -r        # v4 Random
uuidgen -t        # v1 Time-based
```

---

## 🔐 Security Tips

* Use **UUID v4** for most secure and collision-free IDs
* Avoid UUID v1 if you're concerned about timestamp or MAC address leaking
* UUIDs are globally unique but not encrypted — do not use for secrets
* For sensitive data (like passwords), use tokens or encryption

---

## 🔗 Related Tools

* [Token Generator](https://devtoolcafe.com/tools/token-generator)
* [Hash Generator](https://devtoolcafe.com/tools/hash-generator)
* [JWT Decoder](https://devtoolcafe.com/tools/jwt-decoder)
* [Base64 Converter](https://devtoolcafe.com/tools/base64)

---

## 📚 Learn More

* [RFC 4122: UUID Standard](https://datatracker.ietf.org/doc/html/rfc4122)
* [UUID v1 vs v4 Explained](https://www.uuidtools.com/)
* [Why UUIDs?](https://en.wikipedia.org/wiki/Universally_unique_identifier)

---

> 🧠 **Pro Tip:** UUIDs are perfect for frontend-only apps where you need a quick, unique ID without database coordination.

---
