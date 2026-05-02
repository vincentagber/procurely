#!/bin/bash
# Fix postfix to use IPv4 only (fixes Gmail IPv6 rejection)
# Run with: sudo bash fix-postfix-ipv4.sh

echo "Setting postfix to use IPv4 only..."

# Backup original config
sudo cp /etc/postfix/main.cf /etc/postfix/main.cf.backup.$(date +%s)

# Set inet_protocols to ipv4
sudo postconf inet_protocols=ipv4

# Reload postfix
sudo postfix reload 2>/dev/null || sudo launchctl kickstart -k system/com.apple.postfix

echo "Done! Postfix now uses IPv4 only."
echo "Current setting:"
sudo postconf inet_protocols
