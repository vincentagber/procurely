#!/bin/bash
# Wrapper to force IPv4 for sendmail
exec /usr/sbin/sendmail -i "$@"
