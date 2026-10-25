# Production releases

Read `/root/VPS.md` first. The active application is `/var/www/herbgarden-runtime/current`. Immutable artifacts live in `releases/`, and runtime settings in `shared/.env` (0600). Run PM2 as `deploy`.

The Security release validation workflow builds a Linux standalone artifact against a disposable database, with public build settings from VPS_BUILD_PUBLIC_ENV. Download linux-production-release, verify the checksum, extract into a new release directory, and run `deploy/activate-release.sh RELEASE COMMIT` as deploy. The script warms port 3011, checks the database and homepage, switches the current symlink, and rolls back on failure. Keep port 3011 free.

Do not overwrite the shared production environment with build settings. The old `/var/www/herbgarden` directory is retained for rollback. PM2 now supervises Node directly with a 768 MiB heap ceiling and 1024 MiB RSS restart threshold.

Pushes to main automatically validate and activate an immutable release. Runtime secrets remain on the VPS.
