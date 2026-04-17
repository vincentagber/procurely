#!/bin/bash

# Ensure directories exist on the persistent disk
mkdir -p /var/lib/procurely/data
mkdir -p /var/lib/procurely/uploads

# Set permissions
chown -R www-data:www-data /var/lib/procurely

# Create symlink for uploads if it doesn't exist
if [ ! -L /var/www/html/public/uploads ]; then
    ln -s /var/lib/procurely/uploads /var/www/html/public/uploads
fi

# Run migrations/seed if needed (optional, Database.php handles basic schema)
# php scripts/migrate.php

# Start Apache in the foreground
apache2-foreground
