#!/bin/bash

echo "🚀 FixMyBike Server Deployment Script"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the server directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔍 Checking for potential issues..."
echo "✅ Express version: $(node -e "console.log(require('./package.json').dependencies.express)")"
echo "✅ Node version: $(node --version)"

echo "🧪 Testing server startup..."
timeout 10s node server.js &
SERVER_PID=$!

sleep 3

if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server started successfully"
    kill $SERVER_PID
    echo "🚀 Ready for deployment!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Commit and push your changes:"
    echo "   git add ."
    echo "   git commit -m 'Fix Express compatibility and deployment issues'"
    echo "   git push origin main"
    echo ""
    echo "2. Check Render deployment logs"
    echo "3. Test endpoints after deployment"
else
    echo "❌ Server failed to start. Check the logs above."
    exit 1
fi
