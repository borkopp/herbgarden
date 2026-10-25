#!/usr/bin/env bash
set -Eeuo pipefail
app_name=herbgarden
app=/var/www/herbgarden-runtime
port=3004
release=${1:?Release path required}
sha=${2:?Commit required}
test "$(dirname "$release")" = "$app/releases"
test -f "$release/server.js"
test "$(cat "$release/public/deployment.txt")" = "$sha"
test -r "$app/shared/.env"
previous=$(readlink -f "$app/current" || true)
test -z "$(ss -H -ltn 'sport = :3011')"
warmup_pid=''
activated=false
cleanup() {
  if test -n "$warmup_pid"; then kill "$warmup_pid" 2>/dev/null || true; wait "$warmup_pid" 2>/dev/null || true; fi
}
rollback() {
  trap - ERR
  echo 'Release failed; restoring the previous process configuration.' >&2
  cleanup
  if test "$activated" = true; then
    pm2 delete "$app_name" || true
    if test -n "$previous" && test -f "$previous/server.js"; then
      ln -sfn "$previous" "$app/current.next"
      mv -Tf "$app/current.next" "$app/current"
      pm2 start "$app/ecosystem.config.cjs" --only "$app_name"
    else
      rm -f "$app/current"
      pm2 start "$app/shared/first-release-rollback.cjs" --only "$app_name"
    fi
    pm2 save
    chmod 600 "$HOME/.pm2/dump.pm2" "$HOME/.pm2/dump.pm2.bak" 2>/dev/null || true
  fi
  exit 1
}
trap cleanup EXIT
trap rollback ERR
umask 077
cd "$release"
NODE_ENV=production HOSTNAME=127.0.0.1 PORT=3011 \
  NODE_OPTIONS='--no-deprecation --max-old-space-size=768' \
  node --env-file="$app/shared/.env" server.js > "$release/warmup.log" 2>&1 &
warmup_pid=$!
ready=false
for attempt in {1..30}; do
  kill -0 "$warmup_pid"
  if [ "$(curl -fsS --max-time 5 http://127.0.0.1:3011/deployment.txt 2>/dev/null || true)" = "$sha" ]; then ready=true; break; fi
  sleep 2
done
test "$ready" = true
curl -fsS --max-time 120 'http://127.0.0.1:3011/api/media?limit=1&depth=0' >/dev/null
curl -fsSL --max-time 120 http://127.0.0.1:3011/ >/dev/null
cleanup
warmup_pid=''
ln -sfn "$release" "$app/current.next"
mv -Tf "$app/current.next" "$app/current"
activated=true
# Recreate the PM2 entry so it supervises Node directly instead of npm's wrapper.
pm2 delete "$app_name"
pm2 start "$app/ecosystem.config.cjs" --only "$app_name"
healthy=false
for attempt in {1..30}; do
  if [ "$(curl -fsS --max-time 5 "http://127.0.0.1:$port/deployment.txt" 2>/dev/null || true)" = "$sha" ] &&
    curl -fsS --max-time 20 "http://127.0.0.1:$port/api/media?limit=1&depth=0" >/dev/null; then healthy=true; break; fi
  sleep 2
done
test "$healthy" = true
pm2 save
chmod 600 "$HOME/.pm2/dump.pm2" "$HOME/.pm2/dump.pm2.bak" 2>/dev/null || true
trap - ERR
echo "Activated $app_name at $sha"
