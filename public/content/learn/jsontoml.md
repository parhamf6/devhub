---
title: "JSON ⇄ TOML Converter Guide"
lastUpdated: "2023-11-15"
---
# JSON ⇄ TOML Converter
A powerful developer tool to seamlessly convert between JSON and TOML formats, with validation, formatting, error highlighting, and conversion history tracking.
## 🚀 Quick Start
> Tip: Paste your JSON or TOML into the input area, select the conversion direction, and get instant results. Use the action bar for copy, download, beautify, minify, and more.
### Steps
1. **Paste or Input Data**: Enter your JSON or TOML in the input editor. Use the "Example" button to load a sample.
2. **Choose Direction**: Select "JSON → TOML" or "TOML → JSON" to set the conversion mode.
3. **Convert**: The output updates automatically. If you change advanced settings, click "Save & Convert" to apply.
4. **Use Actions**: Copy, download, beautify, minify, upload, or clear your data using the action buttons.
5. **Check Errors**: If your input is invalid, errors are highlighted with line numbers and messages.
6. **History**: View and restore previous conversions from the history panel.
## ⚙️ Options
| Option               | Description                                      | Default         |
|----------------------|--------------------------------------------------|-----------------|
| Mode                 | Conversion direction (JSON→TOML, TOML→JSON, Auto) | JSON→TOML      |
| Indent Size          | Number of spaces for pretty output               | 2               |
| Output Format        | Pretty, Minified, or Compact output              | Pretty          |
| Sort Keys            | Sort object keys alphabetically                  | false           |
| TOML Array Style     | Format for arrays (inline or multiline)         | multiline       |
| Preserve Comments    | Preserve comments in TOML output (when supported) | false        |
## 🛠️ Features
- **Two Editors**: Side-by-side input and output with syntax highlighting.
- **Direction Toggle**: Easily switch between JSON→TOML and TOML→JSON.
- **Action Bar**: Copy, download, beautify, minify, paste, upload, and clear.
- **Error Highlighting**: Invalid input lines are marked and errors shown.
- **Conversion History**: Restore previous conversions with one click.
- **Advanced Settings**: Fine-tune output format, indentation, array style, and more.
- **Toasts & Tooltips**: Instant feedback and helpful hints for every action.
## 📦 Output Format
- **TOML Output**: Well-formed TOML with proper indentation and array formatting.
- **JSON Output**: Standard JSON, with pretty or minified formatting.
- **Error Output**: Error messages with line/column info if input is invalid.
## 💡 Use Cases
* Convert configuration files between JSON and TOML formats.
* Clean up and format JSON or TOML for documentation or code.
* Debug and validate complex TOML or JSON structures.
* Quickly switch between formats for different tools or environments.
* Learn the differences and similarities between JSON and TOML.
## 🔒 Notes & Best Practices
* Always validate your output before using it in production systems.
* TOML is more strict about data types than JSON - ensure your values are compatible.
* For large files, use the upload/download features for convenience.
* Conversion history is stored in your browser session only.
* When converting TOML to JSON, all values are converted to their JSON equivalents.
* TOML arrays can be formatted as inline or multiline depending on your preference.
## 🔧 Code Examples
### JavaScript (Convert JSON to TOML)
```js
const json = { 
  name: "Jane", 
  age: 30,
  skills: ["JavaScript", "TOML"],
  address: {
    street: "123 Main St",
    city: "Anytown"
  }
};
// Converted TOML
const toml = `name = "Jane"
age = 30
skills = ["JavaScript", "TOML"]

[address]
street = "123 Main St"
city = "Anytown"
`;
console.log(toml);
```
### JavaScript (Convert TOML to JSON)
```js
const toml = `
name = "Jane"
age = 30
skills = ["JavaScript", "TOML"]

[address]
street = "123 Main St"
city = "Anytown"
`;
// Converted JSON
const json = {
  "name": "Jane",
  "age": 30,
  "skills": ["JavaScript", "TOML"],
  "address": {
    "street": "123 Main St",
    "city": "Anytown"
  }
};
console.log(JSON.stringify(json, null, 2));
```
### Handling Nested Structures in JSON-TOML Conversion
```js
// JSON with nested objects and arrays
const json = {
  database: {
    server: "192.168.1.1",
    ports: [8001, 8002, 8003],
    connection_max: 5000,
    enabled: true
  },
  owners: [
    {
      name: "John Doe",
      dob: "1979-05-27T07:32:00-08:00"
    },
    {
      name: "Jane Smith",
      dob: "1985-10-12T06:30:00-07:00"
    }
  ]
};

// Converted TOML
const toml = `[database]
server = "192.168.1.1"
ports = [8001, 8002, 8003]
connection_max = 5000
enabled = true

[[owners]]
name = "John Doe"
dob = 1979-05-27T07:32:00-08:00

[[owners]]
name = "Jane Smith"
dob = 1985-10-12T06:30:00-07:00
`;
```

---
Enjoy fast, reliable JSON ⇄ TOML conversion for all your configuration files, application settings, and everyday developer tasks.