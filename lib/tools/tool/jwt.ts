// lib/tools/tool/jwt.ts
import  JWTToolPage  from "@/app/dashboard/tools/jwt/page";

const jwtTool = {
  name: "JWT Decoder & Encoder",
  slug: "jwt",
  description: "Decode and encode JSON Web Tokens with expiration and issuer validation.",
  category: "Security",
  version: "1.0.0",
  tags: ["Security", "JWT", "Token", "Authentication", "Decode", "Encode"],
  component: JWTToolPage, // Reference to the UI page
};

export default jwtTool;
