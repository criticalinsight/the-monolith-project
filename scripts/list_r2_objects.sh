#!/bin/bash

ACCOUNT_ID="c61fd30bce61d2d26de34db53b001e3d"
BUCKET_NAME="the-monolith-assets"
CF_EMAIL="iamkingori@gmail.com"
CF_KEY="013dac06d0e4f28ee42433f39a048fb95fe75"
OUTPUT_FILE="total_r2_sync_list.txt"

rm -f "$OUTPUT_FILE"
CURSOR=""

echo "🔍 Fetching all object keys from R2..."

while true; do
  URL="https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/r2/buckets/$BUCKET_NAME/objects"
  if [ -n "$CURSOR" ]; then
    URL="$URL?cursor=$CURSOR"
  fi
  
  RESPONSE=$(curl -s -X GET "$URL" \
    -H "X-Auth-Email: $CF_EMAIL" \
    -H "X-Auth-Key: $CF_KEY" \
    -H "Content-Type: application/json")
    
  echo "$RESPONSE" | jq -r '.result[].key' >> "$OUTPUT_FILE"
  
  CURSOR=$(echo "$RESPONSE" | jq -r '.result_info.cursor // empty')
  IS_TRUNCATED=$(echo "$RESPONSE" | jq -r '.result_info.is_truncated')
  
  COUNT=$(wc -l < "$OUTPUT_FILE")
  echo "📊 Progress: $COUNT keys collected..."
  
  if [ "$IS_TRUNCATED" != "true" ] || [ -z "$CURSOR" ]; then
    break
  fi
done

echo "✅ Done. Total keys collected: $(wc -l < "$OUTPUT_FILE")"
