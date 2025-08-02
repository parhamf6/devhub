export type CurlBodyType = 'none' | 'json' | 'form' | 'raw';

export type CurlBuilderOptions = {
  method: string;
  url: string;
  query: { key: string; value: string }[];
  headers: { key: string; value: string }[];
  bodyType: CurlBodyType;
  body: string;
  timeout: number;
  followRedirects: boolean;
  maxRedirects: number;
  verifySSL: boolean;
  userAgent: string;
  httpVersion: '1.1' | '2' | '3';
  proxy: string;
  compress: boolean;
};

export type CurlBuilderResult = {
  command: string;
  error?: string;
};

export function buildCurlCommand(options: CurlBuilderOptions): CurlBuilderResult {
  try {
    if (!options.url) {
      return { command: '', error: 'URL is required.' };
    }

    // Build URL with query params
    let url = options.url;
    const queryString = options.query
      .filter(q => q.key)
      .map(q => `${encodeURIComponent(q.key)}=${encodeURIComponent(q.value)}`)
      .join('&');
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }

    const parts: string[] = ['curl'];

    // Method
    if (options.method && options.method !== 'GET') {
      parts.push('-X', options.method);
    }

    // Headers
    options.headers
      .filter(h => h.key)
      .forEach(h => {
        parts.push('-H', `'${h.key}: ${h.value}'`);
      });

    // User-Agent
    if (options.userAgent) {
      parts.push('-A', `'${options.userAgent}'`);
    }

    // Body
    if (options.bodyType !== 'none' && options.body) {
      if (options.bodyType === 'json') {
        parts.push('-H', `'Content-Type: application/json'`);
        parts.push('--data-raw', `'${options.body.replace(/'/g, `'\\''`)}'`);
      } else if (options.bodyType === 'form') {
        // Assume body is key=value&key2=value2
        options.body.split('&').forEach(pair => {
          const [k, v] = pair.split('=');
          if (k) parts.push('-F', `'${k}=${v || ''}'`);
        });
      } else if (options.bodyType === 'raw') {
        parts.push('--data-raw', `'${options.body.replace(/'/g, `'\\''`)}'`);
      }
    }

    // Timeout
    if (options.timeout) {
      parts.push('--max-time', options.timeout.toString());
    }

    // Follow redirects
    if (options.followRedirects) {
      parts.push('-L');
      if (options.maxRedirects) {
        parts.push('--max-redirs', options.maxRedirects.toString());
      }
    }

    // SSL
    if (!options.verifySSL) {
      parts.push('-k');
    }

    // HTTP version
    if (options.httpVersion === '2') {
      parts.push('--http2');
    } else if (options.httpVersion === '3') {
      parts.push('--http3');
    }

    // Proxy
    if (options.proxy) {
      parts.push('--proxy', `'${options.proxy}'`);
    }

    // Compression
    if (options.compress) {
      parts.push('--compressed');
    }

    // URL (always last)
    parts.push(`'${url}'`);

    return { command: parts.join(' ') };
  } catch (e: any) {
    return { command: '', error: e.message || 'Failed to build cURL command.' };
  }
}

const curlBuilder = {
  name: "cURL Builder",
  slug: "curl-builder",
  description: "Advanced cURL command builder for API development, testing, and debugging.",
  category: "Networking",
  version: "1.0.0",
  tags: ["API", "HTTP", "cURL", "Networking", "Builder"],
  build: buildCurlCommand,
};

export default curlBuilder;
export { buildCurlCommand };