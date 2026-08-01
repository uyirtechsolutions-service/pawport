#!/bin/bash
# Run this script from the same folder as pawport-transport-ashan.html.
# It downloads the site's photos into an "images" subfolder so the
# site works fully offline / self-hosted, with no calls to Unsplash at runtime.
#
# Usage:
#   chmod +x download-images.sh
#   ./download-images.sh

set -e
mkdir -p images
cd images

echo "Downloading hero-dog-window.jpg..."
curl -sL "https://images.unsplash.com/photo-1664773450339-d4363f9631c9?auto=format&fit=crop&w=1200&q=80" -o hero-dog-window.jpg

echo "Downloading hero-roadtrip.jpg..."
curl -sL "https://images.unsplash.com/photo-1746483965832-40cd64149b4f?auto=format&fit=crop&w=900&q=80" -o hero-roadtrip.jpg

echo "Downloading service-ground.jpg..."
curl -sL "https://images.unsplash.com/photo-1664773450339-d4363f9631c9?auto=format&fit=crop&w=800&q=80" -o service-ground.jpg

echo "Downloading service-flight.jpg..."
curl -sL "https://images.unsplash.com/photo-1641104556978-418164fb8196?auto=format&fit=crop&w=800&q=80" -o service-flight.jpg

echo "Downloading service-relocation.jpg..."
curl -sL "https://images.unsplash.com/photo-1746483965832-40cd64149b4f?auto=format&fit=crop&w=800&q=80" -o service-relocation.jpg

echo "Downloading service-taxi.jpg..."
curl -sL "https://images.unsplash.com/photo-1689686292316-06773855ca82?auto=format&fit=crop&w=800&q=80" -o service-taxi.jpg

echo "Downloading philosophy-reunion.jpg..."
curl -sL "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&w=1000&q=80" -o philosophy-reunion.jpg

cd ..
echo ""
echo "Done. Images saved to ./images/"