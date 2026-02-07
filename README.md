# 🚀 RSS Feed Generator

A highly customizable RSS feed generator built with Bun, designed for testing RSS feed consumers, ingesting tools, and feed parsers. This project generates realistic RSS content with configurable field behaviors, multiple output formats, and a web-based UI for easy configuration.

## ✨ Features

### 📡 Multiple Feed Formats

- **RSS** (multiple versions: RSS 2.0, RSS 0.91, RSS 0.92)
- **ATOM** feeds
- **JSON Feed** format
- **XML** generic format
- **NEWSML** and **NEWSML-G2** (News Markup Language)
- **NITF** (News Industry Text Format)

### 🎭 Multiple Feed Sources

- **Source Parameter** - Use `?source=name` to create different feed providers
- **Seeded Generation** - Each source generates consistent but unique content
- **Source Identification** - Titles include source names for easy identification
- **Provider Isolation** - No URL conflicts between different providers

### 🎯 Advanced Content Generation

- **Configurable field presence** - Control probability of each field being included
- **Realistic content generation** - Lorem ipsum with proper capitalization and formatting
- **Media support** - Images, videos, and embedded content
- **Flexible date ranges** - Realistic timestamps or sequential dates
- **Author patterns** - Customizable author name generation
- **Category support** - Multiple categories per item

### 🎮 Web-based UI Dashboard

- **Real-time configuration** - Modify settings without restarting
- **Live preview** - See generated feed items instantly
- **Endpoint management** - Enable/disable specific feed formats
- **Field behavior controls** - Adjust probabilities with sliders
- **Force empty/invalid fields** - Perfect for testing error handling

### ⚙️ Configuration Options

- **Feed metadata** - Title, description, language, base URL
- **Item count** - Control number of generated feed items
- **Content options** - Length ranges, media inclusion, HTML support
- **Update intervals** - Auto-regeneration with configurable timing
- **Field behaviors** - Fine-grained control over field presence probabilities

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) runtime (recommended) or Node.js

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd rss-generator

# Install dependencies
bun install
```

### Running the Server

```bash
# Start the server (default port 3000)
bun run index

# Or specify a custom port
PORT=8080 bun run index
```

The server will display a startup banner showing available endpoints.

## 🌐 Web UI

Access the web dashboard at `http://localhost:3000/ui` (or your configured port).

### Dashboard Features

#### 📡 Feed Endpoints

- View all available feed URLs
- Copy endpoint URLs with one click
- See format types for each endpoint

#### ⚡ Quick Actions

- **Regenerate Items** - Generate new feed content immediately
- **Reset Config** - Restore default settings
- **Update Interval** - Set auto-regeneration timing

#### 📰 Feed Settings

- **Feed Title** - Main feed title
- **Description** - Feed description
- **Base URL** - Root URL for generated links
- **Item Count** - Number of items to generate

#### 📝 Content Options

- **Title/Content Length** - Min/max character ranges
- **Image/Video Settings** - Count ranges and inclusion toggles
- **Category Settings** - Number of categories per item
- **Date Options** - Realistic dates vs sequential
- **HTML Support** - Include HTML in content

#### 🎯 Field Behavior

Control the probability (0-100%) of each field appearing:

- **Presence Tab** - Set probabilities for all fields
- **Force Empty** - Select fields to always be empty
- **Force Invalid** - Select fields with invalid values

#### 👁️ Live Preview

- View the most recent 10 generated items
- See titles, authors, dates, and categories
- Real-time updates when settings change

## 📡 Available Endpoints

| Endpoint          | Format    | Description               |
| ----------------- | --------- | ------------------------- |
| `/feed`           | RSS 2.0   | Standard RSS feed         |
| `/feed/rss091`    | RSS 0.91  | Legacy RSS format         |
| `/feed/rss092`    | RSS 0.92  | Legacy RSS format         |
| `/feed/atom`      | ATOM      | Atom syndication format   |
| `/feed/json`      | JSON      | JSON Feed format          |
| `/feed/xml`       | XML       | Generic XML format        |
| `/feed/newsml`    | NEWSML    | News Markup Language      |
| `/feed/newsml-g2` | NEWSML-G2 | NewsML Generation 2       |
| `/feed/nitf`      | NITF      | News Industry Text Format |

### Source Parameter

All feed endpoints support a `?source=` query parameter to create multiple distinct feed providers:

```bash
# Default feed
GET /feed

# Provider-specific feeds
GET /feed?source=cnn
GET /feed?source=bbc
GET /feed?source=foxnews

# Works with all formats
GET /feed/atom?source=techcrunch
GET /feed/json?source=hackernews
```

Each source generates consistent but unique content, with titles including the source name for identification.

### API Endpoints

- `GET /api/config` - Get current configuration
- `PATCH /api/config` - Update feed settings
- `PATCH /api/config/content-options` - Update content generation settings
- `PATCH /api/config/field-behavior` - Update field behavior settings
- `POST /api/config/reset` - Reset to default configuration
- `POST /api/regenerate` - Regenerate feed items
- `GET /api/state` - Get generator state
- `GET /api/items` - Get generated feed items
- `GET /api/endpoints` - Get available feed endpoints

## ⚙️ Configuration

The generator uses a JSON configuration file (`config.json`) that is automatically created with sensible defaults. Settings can be modified through the web UI or by editing the config file directly.

### Key Configuration Sections

#### Feed Metadata

```json
{
  "title": "Test RSS Feed Generator",
  "description": "A highly customizable RSS feed for testing ingestors",
  "link": "http://localhost:3000",
  "language": "en-us"
}
```

#### Content Generation

```json
{
  "contentOptions": {
    "titleLength": { "min": 20, "max": 70 },
    "contentLength": { "min": 500, "max": 3000 },
    "includeImages": true,
    "includeVideos": true,
    "authorPatterns": ["John Smith", "Jane Doe"]
  }
}
```

#### Field Behavior

```json
{
  "fieldBehavior": {
    "titlePresence": 1.0,
    "summaryPresence": 0.9,
    "contentPresence": 1.0,
    "authorPresence": 0.95,
    "forceEmptyFields": [],
    "forceInvalidValues": []
  }
}
```

## 🛠️ Development

### Project Structure

```
src/
├── config.ts          # Configuration management
├── feed-generator.ts  # Content generation logic
├── formatters/        # Feed format formatters
├── routes/            # API and UI route handlers
├── server.ts          # HTTP server setup
└── types.ts           # TypeScript type definitions
```

### Building

```bash
# Type checking
bun run tsc --noEmit

# Development (with hot reload)
bun run index
```

### Testing Feed Consumers

This tool is perfect for testing RSS feed parsers, aggregators, and ingestion systems. Use the field behavior controls to simulate various edge cases:

- **Missing fields** - Test how consumers handle optional fields
- **Invalid data** - Verify error handling with malformed content
- **Large feeds** - Performance testing with many items
- **Rich content** - HTML, images, and embedded media
- **Multiple formats** - Ensure compatibility across feed types

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
