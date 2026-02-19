# Node.js Upgrade Guide

## Current Status
- **Current Node.js version**: v20.10.0
- **Required version**: ^20.19.0 or >=22.12.0
- **Recommended**: Node.js 22.x LTS (latest stable)

## Upgrade Options for Windows

### Option 1: Using nvm-windows (Recommended)
1. Download and install nvm-windows from: https://github.com/coreybutler/nvm-windows/releases
2. Open a new PowerShell/Command Prompt as Administrator
3. Install Node.js 22 LTS:
   ```powershell
   nvm install 22.12.0
   nvm use 22.12.0
   ```
4. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

### Option 2: Direct Download
1. Visit https://nodejs.org/
2. Download the Windows Installer for Node.js 22.x LTS
3. Run the installer and follow the prompts
4. Restart your terminal/IDE
5. Verify:
   ```powershell
   node --version
   npm --version
   ```

### Option 3: Using Chocolatey (if installed)
```powershell
choco upgrade nodejs-lts
```

## After Upgrading

1. **Clean and reinstall dependencies**:
   ```powershell
   cd frontend
   rm -r node_modules
   rm package-lock.json
   npm install
   ```

2. **Verify everything works**:
   ```powershell
   npm run dev
   ```

## Troubleshooting

If you encounter issues after upgrading:
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall
- Restart your IDE/terminal after installation
