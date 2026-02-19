# Version Compatibility Notes

## Current Setup (Temporary Workaround)

- **Vite**: 6.0.7 (compatible with Node.js 20.10.0+)
- **@vitejs/plugin-react**: 4.3.4
- **Node.js**: 20.10.0 (minimum supported)

This is a **temporary workaround** to get the app running with your current Node.js version.

## Recommended Upgrade

For the best experience and latest features, upgrade to:
- **Node.js**: 22.x LTS (or at least 20.19+)
- **Vite**: 7.x (will be automatically installed after Node.js upgrade)

After upgrading Node.js, update `package.json`:
```json
"vite": "^7.3.1",
"@vitejs/plugin-react": "^5.1.1"
```

Then run:
```bash
npm install
```

See [NODE_UPGRADE.md](./NODE_UPGRADE.md) for detailed upgrade instructions.
