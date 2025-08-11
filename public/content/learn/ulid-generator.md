---
title: "ULID Generator – Complete Guide"
lastUpdated: "2025-07-27"
---
# 🆔 ULID Generator

Generate **Universally Unique Lexicographically Sortable Identifiers (ULIDs)** for your applications, databases, and distributed systems. ULIDs combine time-based sorting with randomness for optimal performance.

---
## ✨ Features
- Generate time-based ULIDs with built-in sorting capability
- Custom timestamp support for specific time generation
- Custom entropy input for deterministic generation
- Sort in ascending or descending order
- Toggle uppercase output
- Include timestamp information
- Auto-regenerate on changes
- One-click copy functionality
- Works offline and on mobile
---
## 🚀 Quick Start
> **Tip:** ULIDs are perfect for databases where you need both uniqueness and time-based sorting.
1. **Set Count**: Choose how many ULIDs to generate
2. **Configure Options**:
   - Set custom time (optional)
   - Add custom entropy (optional)
   - Select sort direction
   - Enable uppercase or timestamp display
3. **Copy to Clipboard**: Use the copy icon for quick use
---
## 🧠 What Is a ULID?
A **ULID** (Universally Unique Lexicographically Sortable Identifier) is a 128-bit identifier that combines:
- **48-bit timestamp**: Millisecond precision time since Unix epoch
- **80-bit randomness**: Cryptographically secure entropy

ULIDs are encoded in Crockford's Base32 format, making them URL-safe and lexicographically sortable.

### Structure
```
 01AN4Z07BY      79KA1307SR9X4MV3
└─ Timestamp ─┘ └────── Entropy ────┘
   48 bits          80 bits
```

### Benefits
| Feature | Description |
|---------|-------------|
| **Sortable** | Lexicographically sortable by time |
| **Compact** | 26 characters (shorter than UUID) |
| **URL-safe** | Uses only A-Z and 0-9 (excluding I, L, O, U) |
| **Time-based** | Encodes creation time in the identifier |
| **High entropy** | 80 bits of randomness for collision resistance |
---
## ⚙️ Configuration Options
| Option | Description | Default |
|--------|-------------|---------|
| Count | Number of ULIDs to generate | `5` |
| Custom Time | Set specific timestamp for generation | Current time |
| Custom Entropy | Use specific entropy (16 chars of Crockford's Base32) | Random |
| Sort Direction | Sort order (ascending/descending) | `Ascending` |
| Uppercase | Convert output to uppercase | ❌ |
| Include Timestamp | Show timestamp information alongside ULID | ❌ |
---
## 🛠️ Use Cases
- 🗄️ **Database primary keys** (naturally sorted by creation time)
- 🔄 **Distributed systems** (no coordination needed for unique IDs)
- 📊 **Time-series data** (natural sorting by time)
- 🧪 **Test data seeding** (reproducible with custom entropy)
- 📦 **Event sourcing** (chronological ordering)
- 🌐 **URL identifiers** (compact and URL-safe)
- 🔍 **Log correlation** (time-based grouping)
---
## 🧪 Examples
### 🎲 Default ULID
```
01H5X5JZ5ZQ5Z5Z5Z5Z5Z5Z5Z5
```
### 🕐 Custom Time ULID
```
01H5X5JZ5ZQ5Z5Z5Z5Z5Z5Z5Z5 (Timestamp: 2023-07-27T15:30:45.123Z)
```
### 🔤 Uppercase ULID
```
01H5X5JZ5ZQ5Z5Z5Z5Z5Z5Z5Z5
```
### 📊 Sorted ULIDs (Descending)
```
01H5X5JZ5ZQ5Z5Z5Z5Z5Z5Z5Z5
01H5X5JZ5ZQ5Z5Z5Z5Z5Z5Z5Z4
01H5X5JZ5ZQ5Z5Z5Z5Z5Z5Z5Z3
```
---
## 🔧 Code Examples
### JavaScript (with `ulid` package)
```javascript
import { ulid } from 'ulid';

// Generate standard ULID
console.log(ulid()); // e.g., "01H5X5JZ5ZQ5Z5Z5Z5Z5Z5Z5Z5"

// Generate ULID for specific time
console.log(ulid(1690464000000)); // For specific timestamp

// Generate with custom entropy
console.log(ulid('01H5X5JZ5Z') + 'ABCDEFGHIJKLMNOP');
```
### Python
```python
import ulid
from datetime import datetime

# Generate standard ULID
print(ulid.new()) # e.g., ULID('01H5X5JZ5ZQ5Z5Z5Z5Z5Z5Z5Z5')

# Generate for specific time
specific_time = datetime(2023, 7, 27)
print(ulid.from_timestamp(specific_time))

# Generate with custom entropy
print(ulid.ULID.from_bytes(b'\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'))
```
### Go
```go
package main

import (
	"fmt"
	"time"
	
	"github.com/oklog/ulid/v2"
)

func main() {
	// Generate standard ULID
	t := time.Now()
	entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
	fmt.Println(ulid.MustNew(ulid.Timestamp(t), entropy))
	
	// Generate for specific time
	pastTime := time.Date(2023, 7, 27, 0, 0, 0, 0, time.UTC)
	fmt.Println(ulid.MustNew(ulid.Timestamp(pastTime), entropy))
}
```
### Bash (Linux/macOS)
```bash
# Install ulid tool if not available
npm install -g ulid

# Generate ULID
ulid

# Generate multiple ULIDs
for i in {1..5}; do ulid; done
```
---
## 🔐 Security Tips
* ULIDs use 80 bits of entropy, making them highly collision-resistant
* The timestamp component reveals creation time - avoid if this is sensitive
* For security-critical applications, consider using UUIDv4 instead
* Custom entropy allows deterministic generation - useful for testing but avoid in production
* ULIDs are not encrypted - do not use for secrets or sensitive data
* For cryptographic security, use dedicated cryptographic libraries
---
## 🔗 Related Tools
* [UUID Generator](/dashboard/tools/uuid-generator)
* [Timestamp Generator](/dashboard/tools/timestamp-generator)
* [Hash Generator](/dashboard/tools/hash-generator)
* [Base32 Converter](/dashboard/tools/base32)
* [Token Generator](/dashboard/tools/token-generator)
---
## 📚 Learn More
* [ULID Specification](https://github.com/ulid/spec)
* [Crockford's Base32](https://www.crockford.com/base32.html)
* [ULID vs UUID Comparison](https://blog.the-pans.com/ulid-vs-uuid/)
* [Time-based Identifiers Explained](https://brandur.org/ulid)
* [Lexicographical Sorting in Databases](https://www.2ndquadrant.com/en/blog/sequential-uuids/)
---
> 🧠 **Pro Tip:** ULIDs are ideal for distributed systems where you need both uniqueness and natural time-based sorting without coordination between nodes.
---