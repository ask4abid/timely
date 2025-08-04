# 🕐 Timely - Local Development Guide

## Quick Start (Recommended)

### Option 1: Direct File Opening (Fastest)
Simply double-click `index.html` or run:
```bash
# Windows
start index.html

# PowerShell
Invoke-Item index.html
```

### Option 2: Automated Setup
Run the local development script:
```bash
# Windows Batch
run-local.bat

# PowerShell (Recommended)
powershell -ExecutionPolicy Bypass -File run-local.ps1
```

## Available Versions

- **`index.html`** - Main app with hamburger menu & auth
- **`index-new.html`** - Modern sleek UI version
- **`timeis-digital.html`** - Time.is-inspired digital clock
- **`index-fixed.html`** - Clean version (backup)

## Development Servers

### Node.js (If installed)
```bash
npm install
npm run dev        # Live server with auto-reload
npm run start      # HTTP server
npm run serve      # Static file server
```

### Python (If installed)
```bash
python -m http.server 3000
# Open: http://localhost:3000
```

### VS Code Live Server
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Features Included

✅ **Fixed UTC Format** - Clean +5, -3 format (no decimals)
✅ **Hamburger Menu** - Modern navigation with auth options
✅ **Sign In/Sign Up** - Complete authentication modals
✅ **Responsive Design** - Works on all devices
✅ **Real-time Updates** - Live timezone data
✅ **World Clock Cards** - Beautiful city time displays
✅ **Search Functionality** - Find any city worldwide

## Testing the App

1. **Hamburger Menu**: Click the ☰ icon in the top-right
2. **Authentication**: Try "Sign In" or "Sign Up" buttons
3. **Add Cities**: Use the search to add world clocks
4. **Switch Locations**: Click "Switch Location" button
5. **Theme Toggle**: Use the 🌙 button for dark mode

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Troubleshooting

**App not loading properly?**
- Clear browser cache (Ctrl+F5)
- Check browser console for errors
- Ensure all files are in the correct directory

**Timezone issues?**
- Check browser timezone settings
- Ensure JavaScript is enabled

**Styling issues?**
- Verify `src/css/simple-styles.css` exists
- Check network tab for failed CSS loads

## Development Notes

- UTC format: Uses clean integer format (+5, -8, 0)
- Font consistency: Matching fonts across all sections
- Authentication: Demo implementation (ready for backend integration)
- Mobile-first: Responsive design with hamburger menu

Enjoy your Timely world clock! 🌍⏰
