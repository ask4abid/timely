# Timely Flag Explorer

A modern,  a simple clock app to help us stay in sync across time zones. You can add favorites and use it on desktop or mobile.

## 🌟 Features

- **🔍 Smart Search**: Search for any country by name with intelligent matching
- **🎲 Random Discovery**: Explore random countries to learn about new places
- **⚡ Quick Access**: Favorite countries for instant access
- **📊 Rich Information**: Detailed country data including population, languages, currencies, and more
- **🎨 Modern Design**: Beautiful, responsive interface that works on all devices
- **⚡ Performance Optimized**: Caching, lazy loading, and efficient API usage
- **♿ Accessible**: Full keyboard navigation and screen reader support

## 🚀 Getting Started

### Prerequisites

- Node.js 14+ 
- Modern web browser with ES6 module support

### Installation

1. Clone or download the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

Create a production build:
```bash
npm run build
```

## 🏗️ Architecture

This application follows a modular architecture with clear separation of concerns:

```
src/
├── css/
│   └── styles.css          # Modular CSS with custom properties
├── js/
│   ├── app.js              # Main application orchestrator
│   ├── components/         # UI components
│   │   ├── search-component.js
│   │   └── display-component.js
│   ├── services/           # Business logic services
│   │   └── country-api.js
│   └── utils/              # Utility functions
│       ├── cache.js
│       ├── data-formatter.js
│       ├── dom-utils.js
│       └── logger.js
├── config/
│   └── app-config.js       # Application configuration
└── tests/                  # Test files
```

## 🔧 Configuration

The application uses a centralized configuration system in `config/app-config.js`. Key settings include:

- **API Configuration**: Base URL, endpoints, timeout settings
- **UI Settings**: Default country, animation duration, debounce delays
- **Performance**: Cache settings, lazy loading, preload options
- **Error Messages**: User-friendly error messages

## 🌐 API

The application uses the [REST Countries API](https://restcountries.com/), a free and open-source API that provides:

- Comprehensive country data
- High-quality flag images (SVG format)
- No API key required
- Reliable and fast responses

## 🎨 Theming

The application uses CSS custom properties for easy theming. Key variables are defined in `:root`:

```css
:root {
    --primary-color: #667eea;
    --primary-dark: #5a6fd8;
    --secondary-color: #764ba2;
    /* ... more variables */
}
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 📱 Browser Support

- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 79+

## 🚀 Deployment

### Static Hosting

The application can be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the entire project directory
3. Ensure your server supports ES6 modules

### Recommended Hosting Platforms

- **Netlify**: Automatic deployment from Git
- **Vercel**: Zero-config deployment
- **GitHub Pages**: Free hosting for public repositories
- **Firebase Hosting**: Google's hosting platform

## 🔒 Security

- Input sanitization for all user data
- Content Security Policy headers recommended
- HTTPS required for production deployment

## ♿ Accessibility

- Full keyboard navigation support
- Screen reader compatibility
- ARIA labels and landmarks
- High contrast color scheme
- Responsive design for all screen sizes

## 🎯 Performance

- **Caching**: Intelligent caching with TTL and LRU eviction
- **Lazy Loading**: Images loaded on demand
- **Code Splitting**: Modular JavaScript architecture
- **Compression**: Minified CSS and JavaScript for production
- **API Optimization**: Retry logic and timeout handling

## 🐛 Debugging

In development mode, the following debug commands are available in the browser console:

- `appMetrics()`: View application performance metrics
- `clearAppCache()`: Clear the application cache
- `exportData()`: Export current country data as JSON

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- [REST Countries API](https://restcountries.com/) for providing free country data
- Country flag images from Wikimedia Commons
- Icons and emojis for enhanced user experience

---

**Timely Flag Explorer** - Discover the world, one flag at a time! 🌍
