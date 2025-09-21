#!/bin/bash

echo "🚀 Setting up IPL T20 Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Base URL for the application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Redis connection URL for caching (optional)
REDIS_URL=redis://localhost:6379
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

# Check if Redis is running (optional)
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        echo "✅ Redis is running"
    else
        echo "⚠️  Redis is not running. Caching will be disabled."
        echo "   To enable caching, start Redis: redis-server"
    fi
else
    echo "⚠️  Redis is not installed. Caching will be disabled."
    echo "   To enable caching, install Redis: brew install redis (macOS) or apt install redis (Ubuntu)"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "📚 Available pages:"
echo "  - / (Dashboard with live/upcoming matches)"
echo "  - /points-table (Points table)"
echo "  - /schedule (Full match schedule)"
echo ""
echo "🔧 API endpoints:"
echo "  - /api/matches (Live/upcoming matches)"
echo "  - /api/points-table (Points table data)"
echo "  - /api/schedule (Match schedule)"
