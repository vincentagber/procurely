#!/bin/bash
set -eo pipefail

echo "==> Validating cPanel deployment variables..."

if [ -z "$SSH_PRIVATE_KEY" ]; then echo "Error: SSH_PRIVATE_KEY is missing"; exit 1; fi
if [ -z "$SSH_HOST" ]; then echo "Error: SSH_HOST is missing"; exit 1; fi
if [ -z "$SSH_USER" ]; then echo "Error: SSH_USER is missing"; exit 1; fi

echo "==> Configuring SSH client..."
mkdir -p ~/.ssh
echo "$SSH_PRIVATE_KEY" > ~/.ssh/cpanel_key
chmod 600 ~/.ssh/cpanel_key

# Prevent host key checking warnings
cat >> ~/.ssh/config <<END
Host cpanel_server
  HostName $SSH_HOST
  User $SSH_USER
  IdentityFile ~/.ssh/cpanel_key
  StrictHostKeyChecking no
END

echo "==> Syncing Backend to cPanel..."
# Rsync the backend ignoring tests and local envs. Set strict permissions safe for cPanel (755 dir, 644 file)
rsync -avz --no-perms --no-owner --no-group --exclude='.env' --exclude='tests' --exclude='.git' ./backend/ cpanel_server:$API_DEST_DIR/
ssh cpanel_server "cd $API_DEST_DIR && find . -type d -exec chmod 755 {} \; && find . -type f -exec chmod 644 {} \;"

echo "==> Sycing Frontend Standalone to cPanel..."
# Push only the Next.js standalone folder, static assets, and the standalone server script
rsync -avz --no-perms --no-owner --no-group ./frontend/.next/standalone/ cpanel_server:$FRONTEND_DEST_DIR/
rsync -avz --no-perms --no-owner --no-group ./frontend/.next/static/ cpanel_server:$FRONTEND_DEST_DIR/.next/static/
rsync -avz --no-perms --no-owner --no-group ./frontend/public/ cpanel_server:$FRONTEND_DEST_DIR/public/
rsync -avz --no-perms --no-owner --no-group ./frontend/server.js cpanel_server:$FRONTEND_DEST_DIR/server.js

# Note: Depending on Passenger/CloudLinux settings, you may trigger app restart via a bash ping to the node app.
ssh cpanel_server "mkdir -p $FRONTEND_DEST_DIR/tmp && touch $FRONTEND_DEST_DIR/tmp/restart.txt"

echo "==> cPanel Deployment Pipeline OK!"
