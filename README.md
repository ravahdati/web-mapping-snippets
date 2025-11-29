# Web Mapping Snippets

![License](https://img.shields.io/github/license/ravahdati/web-mapping-snippets)
![GitHub Stars](https://img.shields.io/github/stars/ravahdati/web-mapping-snippets?style=social)
![GitHub Forks](https://img.shields.io/github/forks/ravahdati/web-mapping-snippets?style=social)
![GitHub Issues](https://img.shields.io/github/issues/ravahdati/web-mapping-snippets)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/ravahdati/web-mapping-snippets)
![Last Commit](https://img.shields.io/github/last-commit/ravahdati/web-mapping-snippets)

A comprehensive collection of map integration snippets for multiple programming languages and frameworks. This repository provides ready-to-use code for integrating various map providers into your web applications.

## 🗺️ Supported Map Providers

- **Google Maps** - Global mapping service
- **CedarMaps** - Iranian mapping service
- **Neshan** - Popular Iranian navigation and mapping service
- **Map.ir** - Iranian mapping service
- **ParsiMap** - Iranian mapping service
- **Mapbox** - Customizable mapping platform
- **OpenStreetMap (OSM)** - Open-source mapping solution
- **Bing Maps** - Microsoft's mapping service
- **Yandex Maps** - Russian mapping service

## 🚀 Available Implementations

This repository includes implementations in the following languages and frameworks:

- **PHP** - Vanilla PHP functions
- **Laravel** - Laravel helper class with config integration
- **Python** - Python functions with HTML generation
- **.NET Core C#** - C# class library
- **Node.js** - Server-side JavaScript
- **Pure JavaScript** - Client-side class-based implementation

## 📦 Installation

Simply clone this repository and use the implementation that fits your project:

```bash
git clone https://github.com/ravahdati/web-mapping-snippets.git
```

## 📖 Usage Examples

### PHP

```php
<?php
require_once 'map.php';

// Show available map providers
$providers = show_available_maps();
print_r($providers);

// Display a map
echo display_map_with_location(35.6892, 51.3890, 'google');
?>
```

### Laravel

```php
<?php
// In your controller
use App\Helpers\MapHelper;

$mapHtml = MapHelper::displayMapWithLocation(35.6892, 51.3890, 'cedarmaps');

// In your Blade view
{!! MapHelper::displayMapWithLocation($latitude, $longitude, 'neshan') !!}

// Get available providers
$providers = MapHelper::showAvailableMaps();
```

**Laravel Configuration:**

Add to your `config/services.php`:

```php
'google_maps' => [
    'key' => env('GOOGLE_MAPS_API_KEY'),
],
'cedarmaps' => [
    'token' => env('CEDARMAPS_TOKEN'),
],
'neshan' => [
    'key' => env('NESHAN_API_KEY'),
],
// ... add other providers
```

### Python

```python
from map import display_map_with_location, show_available_maps

# Show available providers
providers = show_available_maps()
print(providers)

# Generate map HTML
html = display_map_with_location(35.6892, 51.3890, 'mapbox')
print(html)
```

### .NET Core C#

```csharp
using WebMappingSnippets;

// Show available providers
var providers = MapHelper.ShowAvailableMaps();

// Display map
string mapHtml = MapHelper.DisplayMapWithLocation(35.6892, 51.3890, "osm");
```

### Node.js

```javascript
const { displayMapWithLocation, showAvailableMaps } = require('./map.js');

// Show available providers
const providers = showAvailableMaps();
console.log(providers);

// Generate map HTML
const mapHtml = displayMapWithLocation(35.6892, 51.3890, 'bing');
```

### Pure JavaScript (Client-side)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Map Example</title>
</head>
<body>
    <div id="map"></div>

    <script src="map-client.js"></script>
    <script>
        // Get available providers
        const providers = MapRenderer.getAvailableMaps();
        console.log(providers);

        // Display map
        const mapRenderer = new MapRenderer('map');
        mapRenderer.displayMap(35.6892, 51.3890, 'google');
    </script>
</body>
</html>
```

## 🔑 API Keys

You need to obtain API keys/tokens for the map providers you want to use:

- **Google Maps**: [Get API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
- **CedarMaps**: [Get Access Token](https://www.cedarmaps.com/)
- **Neshan**: [Get API Key](https://developer.neshan.org/)
- **Map.ir**: [Get Access Token](https://corp.map.ir/)
- **ParsiMap**: [Get API Key](https://www.parsimap.com/)
- **Mapbox**: [Get Access Token](https://www.mapbox.com/)
- **Bing Maps**: [Get API Key](https://www.microsoft.com/en-us/maps/create-a-bing-maps-key)
- **Yandex Maps**: [Get API Key](https://developer.tech.yandex.ru/)

Remember to replace placeholder keys in the code with your actual API keys.

## 📁 File Structure

```
web-mapping-snippets/
├── map.php              # PHP implementation
├── MapHelper.php        # Laravel helper class
├── map.py               # Python implementation
├── MapHelper.cs         # .NET Core C# implementation
├── map.js               # Node.js implementation
├── map-client.js        # Pure JavaScript (client-side)
├── cedarmaps.html       # CedarMaps example
├── LICENSE              # MIT License
└── README.md            # This file
```

## 🛠️ Features

- ✅ Multiple map provider support
- ✅ Easy integration
- ✅ Consistent API across languages
- ✅ Production-ready code
- ✅ Well-documented
- ✅ Open source (MIT License)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Star History

If you find this project useful, please consider giving it a star!

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

## 🙏 Acknowledgments

- Thanks to all map providers for their excellent services
- Inspired by the need for simple, reusable mapping code snippets
- Built with ❤️ for the developer community

---

**Made with ❤️ by the community**
