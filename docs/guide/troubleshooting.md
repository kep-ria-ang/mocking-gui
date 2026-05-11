# Troubleshooting

Common issues encountered while using the library and how to resolve them.

## Handler is enabled but mock is not applied

### Symptom

You enabled a handler and selected a response variant in the GUI panel, but requests are still being forwarded to the real server.

### Cause & Solution

**1. URL pattern does not match the actual request**

The handler's `url` must exactly match the actual request URL. Check whether the base URL is included.

```typescript
// Actual request: https://api.example.com/users/123
// ❌ Does not match
{ url: '/users/:id', method: 'get' }

// ✅ Matches
{ url: 'https://api.example.com/users/:id', method: 'get' }
```

---

## Swagger source is added but fails to load

### Symptom

The source status in the Swagger tab stays as pending or shows an error.

### Cause & Solution

**1. CORS error**

If the `configUrl` server does not allow CORS, the browser will fail to fetch it. Check the response headers in the browser's Network tab.

**2. `configUrl` does not return a valid OpenAPI JSON**

The `configUrl` must be the direct URL to the OpenAPI spec JSON, not the Swagger UI page URL.

```typescript
// ❌ Swagger UI page URL
{
  configUrl: 'https://api.example.com/swagger-ui';
}

// ✅ OpenAPI JSON URL
{
  configUrl: 'https://api.example.com/v3/api-docs';
}
```

---

## Service Worker fails to install in a local HTTPS environment

### Symptom

The Service Worker is not installed and Mocking GUI does not work when running the local dev server over HTTPS.

### Cause & Solution

If your local HTTPS setup has an untrusted or self-signed certificate, the browser will block the Service Worker from being registered. Resolve the certificate issue first, then retry.

**Common fixes:**

- Use a tool like [mkcert](https://github.com/FiloSottile/mkcert) to generate a locally-trusted certificate and add it to your system's trust store.
- If using a self-signed certificate, manually trust it in your browser before accessing the dev server.
- Alternatively, run the dev server over HTTP during local development if HTTPS is not strictly required.

> **Note:** Service Workers require either `localhost` or a secure HTTPS origin with a valid certificate. An untrusted certificate is treated the same as an insecure origin.

---

## Still having issues?

If the above solutions didn't help, feel free to reach out through the following channels.

- **Issues**: [GitHub Issues](https://github.com/kakaoenterprise/mocking-gui/issues) — Bug reports and feature requests
- **Discussions**: [GitHub Discussions](https://github.com/kakaoenterprise/mocking-gui/discussions) — Usage questions and general feedback
