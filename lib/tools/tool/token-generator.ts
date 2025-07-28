// lib/tools/tokenGenerator.ts
import { ToolSchema } from "../tool-schema";

export type TokenOptions = {
  length: number;
  useLower: boolean;
  useUpper: boolean;
  useNumber: boolean;
  useSymbol: boolean;
};

function generateToken({
  length,
  useLower,
  useUpper,
  useNumber,
  useSymbol,
}: TokenOptions): string {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';

  let charset = '';
  if (useLower) charset += lower;
  if (useUpper) charset += upper;
  if (useNumber) charset += numbers;
  if (useSymbol) charset += symbols;

  if (!charset) return '';

  return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
}

const tokenGenerator= {
  name: "Token Generator",
  slug: "token-generator",
  description: "generate custome tokens",
  category: "Security",
  version: "8.55.0",
  tags: ["Security", "Token"],
  generate: (options: TokenOptions) => generateToken(options),
};

export default tokenGenerator;

