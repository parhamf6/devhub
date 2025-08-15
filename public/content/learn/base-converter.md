---
title: "Base Converter – Complete Guide"
lastUpdated: "2025-07-29"
---
# 🔢 Base Converter
Convert numbers between binary, octal, decimal, hexadecimal, and custom bases (2-36) with real-time conversion, advanced operations, and developer-friendly features. Perfect for low-level programming, network protocols, cryptography, and digital systems work.
## ✨ Features
- Real-time conversion between 5 number bases
- Custom base support (2-36)
- Bitwise operations (AND, OR, XOR, NOT)
- Arithmetic operations in different bases
- Bit manipulation tools (set, clear, toggle, test)
- Number information panel (bit length, byte size)
- Format options (uppercase hex, bit grouping)
- Conversion history and favorites
- Export results as JSON/CSV
- Shareable links with current values
- Input validation with error handling
- Keyboard shortcuts (Ctrl+C, Escape)
- Responsive design for all devices
---
## 🚀 Quick Start
1. **Enter a Value**: Type or paste a number in any base field
2. **Automatic Conversion**: All other base fields update instantly
3. **Advanced Operations**: Switch to the Operations tab for calculations
4. **Save Your Work**: Add frequent conversions to favorites
5. **Export Results**: Download as JSON/CSV or generate shareable links
> 💡 Tip: The tool auto-detects valid input for each base and highlights errors in real-time.
---
## ⚙️ Configuration Options
| Option | Description | Default |
|--------|-------------|---------|
| **Input Fields** | Binary, Octal, Decimal, Hexadecimal, Custom | All empty |
| **Custom Base** | User-defined base (2-36) | `16` |
| **Bit Grouping** | Group bits in output (4/8/16 bits) | `4 bits` |
| **Uppercase Hex** | Display hexadecimal in uppercase | ✅ |
| **Show Prefixes** | Display 0b, 0o, 0x prefixes | ✅ |
| **History Size** | Number of remembered conversions | `5` |
| **Auto-Process** | Real-time conversion as you type | ✅ |
| **Error Highlight** | Visual indication of invalid input | ✅ |
---
## 🛠️ Use Cases
- 🔧 Low-level programming and debugging
- 🌐 Network protocol development
- 🔐 Cryptography and hash functions
- 💾 Memory address manipulation
- 🎮 Game development (bit flags)
- 📱 Embedded systems programming
- 🧪 Computer science education
- 📊 Data encoding for transmission
- 🔢 Mathematical calculations in different bases
---
## 🧪 Examples
### ✅ Decimal to Binary Conversion
**Input:**
```
42
```
**Output:**
```
0b101010
```
### 🔢 Hexadecimal to Decimal Conversion
**Input:**
```
0xFF
```
**Output:**
```
255
```
### 📊 Custom Base Conversion
**Input (Base 36):**
```
DEVHUB
```
**Output (Decimal):**
```
659316782
```
### 🔧 Bitwise AND Operation
**Operand A:** `0b1010` (10)  
**Operand B:** `0b1100` (12)  
**Result:** `0b1000` (8)
### 🎯 Bit Manipulation
**Value:** `0b101010` (42)  
**Operation:** Toggle bit at position 3  
**Result:** `0b100010` (34)
---
## 🔧 Code Examples
### JavaScript (Browser/Node.js)
```javascript
// Convert decimal to binary
function decToBinary(dec) {
  return (dec >>> 0).toString(2);
}

// Convert binary to decimal
function binaryToDec(bin) {
  return parseInt(bin.replace(/^0b/, ''), 2);
}

// Convert decimal to hexadecimal
function decToHex(dec, uppercase = true) {
  let hex = dec.toString(16);
  return uppercase ? hex.toUpperCase() : hex;
}

// Convert hexadecimal to decimal
function hexToDec(hex) {
  return parseInt(hex.replace(/^0x/, ''), 16);
}

// Bitwise AND operation
function bitAnd(a, b) {
  return a & b;
}

// Set bit at position
function setBit(num, pos) {
  return num | (1 << pos);
}

// Usage examples
console.log(decToBinary(42));      // 101010
console.log(binaryToDec("101010")); // 42
console.log(decToHex(255));        // FF
console.log(hexToDec("FF"));       // 255
console.log(bitAnd(10, 12));       // 8
console.log(setBit(42, 3));        // 50
```
### Python (CLI or Backend)
```python
# Convert decimal to binary
def dec_to_binary(dec):
    return bin(dec)

# Convert binary to decimal
def binary_to_dec(bin_str):
    return int(bin_str.replace("0b", ""), 2)

# Convert decimal to hexadecimal
def dec_to_hex(dec, uppercase=True):
    hex_str = hex(dec)
    return hex_str.upper() if uppercase else hex_str

# Convert hexadecimal to decimal
def hex_to_dec(hex_str):
    return int(hex_str.replace("0x", ""), 16)

# Bitwise OR operation
def bit_or(a, b):
    return a | b

# Clear bit at position
def clear_bit(num, pos):
    return num & ~(1 << pos)

# Usage examples
print(dec_to_binary(42))          # 0b101010
print(binary_to_dec("0b101010"))  # 42
print(dec_to_hex(255))            # 0xFF
print(hex_to_dec("0xFF"))         # 255
print(bit_or(10, 12))             # 14
print(clear_bit(42, 1))           # 40
```
### Bash (Linux/macOS)
```bash
# Convert decimal to binary
echo "obase=2; 42" | bc

# Convert binary to decimal
echo "ibase=2; 101010" | bc

# Convert decimal to hexadecimal
echo "obase=16; 255" | bc

# Convert hexadecimal to decimal
echo "ibase=16; FF" | bc

# Bitwise XOR using bc
echo "obase=2; 10 ^ 12" | bc

# Set bit at position (using bitwise OR)
echo "$(( 42 | (1 << 3) ))"
```
### PHP (Web Development)
```php
<?php
// Convert decimal to binary
function dec_to_binary($dec) {
    return decbin($dec);
}

// Convert binary to decimal
function binary_to_dec($bin) {
    return bindec($bin);
}

// Convert decimal to hexadecimal
function dec_to_hex($dec, $uppercase = true) {
    $hex = dechex($dec);
    return $uppercase ? strtoupper($hex) : $hex;
}

// Convert hexadecimal to decimal
function hex_to_dec($hex) {
    return hexdec($hex);
}

// Bitwise NOT operation
function bit_not($num) {
    return ~$num;
}

// Toggle bit at position
function toggle_bit($num, $pos) {
    return $num ^ (1 << $pos);
}

// Usage examples
echo dec_to_binary(42);          // 101010
echo binary_to_dec("101010");    // 42
echo dec_to_hex(255);            // FF
echo hex_to_dec("FF");           // 255
echo bit_not(10);                // -11
echo toggle_bit(42, 1);          // 40
?>
```
---
## 🔢 Technical Details
### Number Bases Explained
Number bases (or radix) determine how many unique digits represent values in a numbering system:
- **Binary (Base 2)**: Uses 0 and 1. Fundamental to digital systems.
- **Octal (Base 8)**: Uses digits 0-7. Historically used in computing.
- **Decimal (Base 10)**: Uses digits 0-9. Standard human numbering system.
- **Hexadecimal (Base 16)**: Uses digits 0-9 and letters A-F. Compact representation of binary data.
- **Custom Base (2-36)**: User-defined base using digits 0-9 and letters A-Z.

### Conversion Process
1. **Parse Input**: Remove prefixes (0b, 0o, 0x) and validate characters
2. **Convert to Decimal**: Transform source value to base 10
3. **Convert to Target Base**: Transform decimal value to target base
4. **Apply Formatting**: Add prefixes, adjust case, group bits
5. **Display Results**: Show formatted values in all base fields

### Bitwise Operations
Bitwise operations manipulate individual bits:
- **AND (&)**: Sets bit to 1 only if both bits are 1
- **OR (|)**: Sets bit to 1 if either bit is 1
- **XOR (^)**: Sets bit to 1 if bits are different
- **NOT (~)**: Flips all bits (0 becomes 1, 1 becomes 0)

### Bit Manipulation
- **Set Bit**: Force a specific bit to 1
- **Clear Bit**: Force a specific bit to 0
- **Toggle Bit**: Flip a specific bit (0→1, 1→0)
- **Test Bit**: Check if a specific bit is set (1) or not (0)
---
## 🛡️ Security Considerations
* **Input Validation**: The tool validates all inputs to prevent errors
* **No Data Transmission**: All processing happens locally in your browser
* **Large Number Handling**: Uses BigInt to prevent overflow with large numbers
* **Memory Management**: Efficient algorithms prevent browser freezing
* **Privacy**: No conversion data is sent to any server
---
## 🔧 Common Issues & Solutions
### Invalid Character Error
```
Problem: "Invalid characters for base X" error
Solution: Ensure you're only using valid digits for the selected base
```
### Large Number Overflow
```
Problem: Extremely large numbers not converting properly
Solution: Use BigInt format (append 'n' to decimal numbers) or split into chunks
```
### Negative Numbers
```
Problem: Negative values not converting correctly
Solution: Use two's complement representation for binary/hex values
```
### Custom Base Limitations
```
Problem: Custom base above 36 not supported
Solution: Bases above 36 would require additional symbols beyond Z
```
---
## 📊 Performance Tips
* **Debounced Input**: Conversions are slightly delayed as you type for better performance
* **Large Numbers**: For extremely large values, consider using scientific notation
* **Batch Operations**: Use the export feature for processing multiple numbers
* **Memory Usage**: Clear history regularly if working with many large numbers
* **Keyboard Shortcuts**: Use Ctrl+C to copy values quickly without mouse clicks
---
## 🔗 Related Tools
* [Binary/Hex/Decimal Converter](/dashboard/tools/base-converter)
* [Bitwise Calculator](/dashboard/tools/bitwise-calculator)
* [CRC Calculator](/dashboard/tools/crc-calculator)
* [Number Base Calculator](/dashboard/tools/number-base-calculator)
* [IP Address Converter](/dashboard/tools/ip-converter)
---
## 📚 Learn More
* [Number Systems on Wikipedia](https://en.wikipedia.org/wiki/Numeral_system)
* [Binary Number System on Khan Academy](https://www.khanacademy.org/math/algebra-home/alg-intro-to-algebra/algebra-alternate-number-bases/v/introduction-to-number-systems-and-binary)
* [Bitwise Operations on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators)
* [Number Base Conversion Tutorial](https://www.tutorialspoint.com/computer_logical_organization/number_system_conversion.htm)
* [Hexadecimal Color Codes](https://www.w3schools.com/colors/colors_hexadecimal.asp)
---
> 🧠 **Pro Tip**: Use the bit grouping feature to make binary values more readable! Grouping by 8 bits (bytes) is especially useful for memory address and file format work.