#!/bin/sh

# Default to empty array if not set
REFERRER_HOSTS=${REFERRER_HOSTS:-""}

# Create the config.js file
cat <<EOF > /usr/share/nginx/html/config.js
window.APP_CONFIG = {
  referrerHost: [
    $(echo $REFERRER_HOSTS | sed 's/,/","/g' | sed 's/^/"/' | sed 's/$/"/')
  ]
};
EOF

# If REFERRER_HOSTS is empty, the array will be [""], let's fix that if needed.
# Actually, if it's empty string, we want empty array.
if [ -z "$REFERRER_HOSTS" ]; then
cat <<EOF > /usr/share/nginx/html/config.js
window.APP_CONFIG = {
  referrerHost: []
};
EOF
fi

# Execute the CMD from Dockerfile
exec "$@"
