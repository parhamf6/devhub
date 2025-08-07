

---
title: "JSON ⇄ XML Converter Guide"
lastUpdated: "2025-07-30"
---
# JSON ⇄ XML Converter
A developer tool to quickly convert between JSON and XML formats, with validation, formatting, error highlighting, and conversion history.
## 🚀 Quick Start
> Tip: Paste your JSON or XML into the input area, select the conversion direction, and get instant results. Use the action bar for copy, download, beautify, minify, and more.
### Steps
1. **Paste or Input Data**: Enter your JSON or XML in the input editor. Use the "Example" button to load a sample.
2. **Choose Direction**: Select "JSON → XML" or "XML → JSON" to set the conversion mode.
3. **Convert**: The output updates automatically. If you change advanced settings, click "Save & Convert" to apply.
4. **Use Actions**: Copy, download, beautify, minify, upload, or clear your data using the action buttons.
5. **Check Errors**: If your input is invalid, errors are highlighted with line numbers and messages.
6. **History**: View and restore previous conversions from the history panel.
## ⚙️ Options
| Option               | Description                                      | Default         |
|----------------------|--------------------------------------------------|-----------------|
| Mode                 | Conversion direction (JSON→XML, XML→JSON, Auto) | JSON→XML        |
| Indent Size          | Number of spaces for pretty output               | 2               |
| Output Format        | Pretty, Minified, or Compact output              | Pretty          |
| Sort Keys            | Sort object keys alphabetically                  | false           |
| XML Declaration      | Include XML declaration in output               | true            |
| Root Element         | Name for the root element in XML output         | root            |
| Attribute Prefix     | Prefix for XML attributes in JSON output        | @_              |
| Text Node Name       | Property name for text content in JSON output   | #text           |
## 🛠️ Features
- **Two Editors**: Side-by-side input and output with syntax highlighting.
- **Direction Toggle**: Easily switch between JSON→XML and XML→JSON.
- **Action Bar**: Copy, download, beautify, minify, paste, upload, and clear.
- **Error Highlighting**: Invalid input lines are marked and errors shown.
- **Conversion History**: Restore previous conversions with one click.
- **Advanced Settings**: Fine-tune output format, indentation, XML declaration, and more.
- **Toasts & Tooltips**: Instant feedback and helpful hints for every action.
## 📦 Output Format
- **XML Output**: Well-formed XML with optional declaration, customizable root element, and proper indentation.
- **JSON Output**: Standard JSON, with pretty or minified formatting and configurable attribute/text node naming.
- **Error Output**: Error messages with line/column info if input is invalid.
## 💡 Use Cases
* Convert API responses or config files between JSON and XML.
* Clean up and format JSON or XML for documentation or code.
* Debug and validate complex XML or JSON structures.
* Quickly switch between formats for different tools or environments.
* Learn the differences and similarities between JSON and XML.
## 🔒 Notes & Best Practices
* Always validate your output before using it in production systems.
* XML attributes are converted to JSON objects with the specified attribute prefix.
* For large files, use the upload/download features for convenience.
* Conversion history is stored in your browser session only.
* When converting XML to JSON, repeated elements become arrays in JSON.
## 🔧 Code Examples
### JavaScript (Convert JSON to XML)
```js
const json = { 
  name: "Jane", 
  age: 30,
  skills: ["JavaScript", "XML"]
};
// Using a library like fast-xml-parser or xmlbuilder2
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <name>Jane</name>
  <age>30</age>
  <skills>JavaScript</skills>
  <skills>XML</skills>
</root>`;
console.log(xml);
```
### JavaScript (Convert XML to JSON)
```js
const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <name>Jane</name>
  <age>30</age>
  <skills>JavaScript</skills>
  <skills>XML</skills>
</root>`;
// Using a library like fast-xml-parser
const json = {
  "name": "Jane",
  "age": 30,
  "skills": ["JavaScript", "XML"]
};
console.log(JSON.stringify(json, null, 2));
```
### Handling Attributes in JSON-XML Conversion
```js
// XML with attributes
const xmlWithAttrs = `
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <person id="123" status="active">
    <name>Jane</name>
  </person>
</root>`;

// Converted JSON (with default attribute prefix)
const jsonWithAttrs = {
  "person": {
    "@_id": "123",
    "@_status": "active",
    "name": "Jane"
  }
};
```
---
Enjoy fast, reliable JSON ⇄ XML conversion for all your configuration files, API payloads, and everyday developer tasks.