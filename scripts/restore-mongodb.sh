#!/bin/bash

# Configuration
DB_NAME="herbgarden"
BACKUP_DIR="./backups"

# Check if an argument was provided
if [ -z "$1" ]; then
    echo "❌ Please provide the backup file name (e.g., 2026-03-09_19-34-14.tar.gz)"
    echo "📂 Available backups in $BACKUP_DIR:"
    ls -1 "$BACKUP_DIR"/*.tar.gz 2>/dev/null | xargs -n 1 basename
    exit 1
fi

BACKUP_FILE="$BACKUP_DIR/$1"

# Check if file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "🚀 Starting MongoDB restore for database: $DB_NAME"
echo "📦 Using archive: $BACKUP_FILE"

# Create a temporary directory for extraction
TEMP_DIR=$(mktemp -d)
echo "📂 Extracting to temporary directory..."

if tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"; then
    # Find the extracted directory (it should be the timestamp name)
    # Since we zipped the directory, we need to find the bson files inside
    EXTRACTED_DIR=$(ls "$TEMP_DIR")
    
    echo "🔄 Running mongorestore..."
    if mongorestore --db="$DB_NAME" --drop "$TEMP_DIR/$EXTRACTED_DIR/$DB_NAME"; then
        echo "✅ Restore completed successfully!"
    else
        echo "❌ mongorestore failed!"
    fi
else
    echo "❌ Extraction failed!"
fi

# Cleanup
rm -rf "$TEMP_DIR"
echo "🧹 Cleaned up temporary files."
