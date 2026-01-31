#!/bin/bash

# Configuration
BUCKET_NAME="the-monolith-assets"
LIST_FILE="total_r2_sync_list.txt"

echo "🚀 Starting Full Asset Import from R2..."

if [ ! -f "$LIST_FILE" ]; then
    echo "❌ Error: $LIST_FILE not found."
    exit 1
fi

# We need the credentials in the environment
# Assuming they are already exported in the calling shell or we'll wrap the call

while IFS= read -r key; do
    if [ -z "$key" ]; then continue; fi
    
    # Remove leading slash if present (key shouldn't have it but just in case)
    clean_key=$(echo "$key" | sed 's|^/||')
    
    # Define local path (same as key)
    local_path="$clean_key"
    
    # Create directory if it doesn't exist
    mkdir -p "$(dirname "$local_path")"
    
    echo "📥 Downloading: $clean_key ..."
    npx wrangler r2 object get "$BUCKET_NAME/$clean_key" --file "$local_path" --remote
    
    if [ $? -eq 0 ]; then
        echo "✅ Downloaded $clean_key"
    else
        echo "⚠️ Failed to download $clean_key"
    fi
done < "$LIST_FILE"

echo "✨ Full Import Complete."
