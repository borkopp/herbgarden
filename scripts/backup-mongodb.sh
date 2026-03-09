#!/bin/bash

# Configuration
DB_NAME="herbgarden"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
OUTPUT_DIR="$BACKUP_DIR/$TIMESTAMP"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "🚀 Starting MongoDB backup for database: $DB_NAME"
echo "📂 Output directory: $OUTPUT_DIR"

# Run mongodump
if mongodump --db="$DB_NAME" --out="$OUTPUT_DIR"; then
    echo "✅ Backup completed successfully!"
    echo "📄 You can find your backup at: $OUTPUT_DIR"
    
    # Optional: Create a compressed archive
    echo "📦 Creating compressed archive..."
    tar -czf "$OUTPUT_DIR.tar.gz" -C "$BACKUP_DIR" "$TIMESTAMP"
    echo "✅ Archive created: $OUTPUT_DIR.tar.gz"
    
    # Optional: Remove the uncompressed directory to save space
    rm -rf "$OUTPUT_DIR"
    echo "🧹 Cleaned up uncompressed files."
else
    echo "❌ Backup failed!"
    exit 1
fi
