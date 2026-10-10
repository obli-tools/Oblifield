# Oblifield

**Field intervention management for IT service companies: dispatch, technician check-in / check-out, photos, signatures and PDF reports.**

Oblifield schedules and tracks on-site interventions for your clients and their sites. Technicians work from a mobile technician panel reached through signed links: they check in and out with a GPS position, add photos, notes, parts and signatures. Managers get a live dashboard, a map, recurring schedules and branded PDF reports.

Website: [field.obli.tools](https://field.obli.tools)

## Key features

- **Intervention lifecycle**: statuses from pending to done (or issue / cancelled), types, priorities, steps and step templates.
- **Technician panel**: a mobile page on its own host name, opened through signed links, with check-in / check-out (GPS position and timestamps), photos, notes, parts and signatures.
- **PDF reports**: branded intervention reports with comments, photos and signatures, also sent by e-mail with templates.
- **Clients and sites**: nested clients and sites with addresses, geocoding and a map view.
- **Recurring schedules** for planned maintenance.
- **Manager dashboard**: live status, today's schedule and recent activity.
- **Reports and exports**: per technician, client or period, with CSV export; JSON import / export of the configuration.
- **Documentation base** organised by categories.
- **Notifications**: Telegram, Discord, Slack, Microsoft Teams, e-mail (SMTP), webhook, Gotify, ntfy, Pushover and Free Mobile.
- **Platform**: multi-tenancy, teams and permission sets, two-factor authentication, audit log, real-time updates, English and French UI.

## Quick install

```sh
curl -fsSL https://raw.githubusercontent.com/obli-tools/Oblifield/main/install.sh | sh
```

The installer runs on Linux, or on macOS with Docker Desktop. It:

- checks Docker and Docker Compose; on Linux it offers to install them with Docker's official script, only after you confirm;
- downloads `docker-compose.yml` and `.env.example` into `./oblifield`;
- creates `.env` with unique random secrets (`DB_PASSWORD`, `SESSION_SECRET`, initial admin password);
- pulls the images, starts the stack and prints the panel URL and the initial admin password (shown only once).

Running it again upgrades an existing install; `.env` is never modified.

Options (pass them after `sh -s --`):

| Option | Description |
|--------|-------------|
| `-y`, `--yes` | Non-interactive: accept the defaults and install Docker if it is missing |
| `--dir PATH` | Install directory (default `./oblifield`) |
| `--port PORT` | Host port of the web interface (default `3006`, first install only) |
| `--url URL` | Public URL of the panel, e.g. `https://oblifield.example.com` (first install only) |

```sh
curl -fsSL https://raw.githubusercontent.com/obli-tools/Oblifield/main/install.sh | sh -s -- -y --dir /opt/oblifield --url https://oblifield.example.com
```

`--help` lists every option.

## Manual install (Docker Compose)

```sh
mkdir oblifield && cd oblifield
curl -fsSLO https://raw.githubusercontent.com/obli-tools/Oblifield/main/docker-compose.yml
curl -fsSLO https://raw.githubusercontent.com/obli-tools/Oblifield/main/.env.example
cp .env.example .env
# Edit .env: set DB_PASSWORD, SESSION_SECRET (a long random string), DEFAULT_ADMIN_PASSWORD,
# CLIENT_ORIGIN (the public URL of the panel) and TECH_PANEL_HOSTNAME.
docker compose up -d
```

The panel answers on port `3006` (`LISTEN_PORT`). The stack runs PostgreSQL 16, the server (`meejay/oblifield-server`) and the web client (`meejay/oblifield-client`). To use an existing PostgreSQL server instead, see `docker-compose.external-db.yml`.

## Update

```sh
docker compose pull && docker compose up -d
```

Or run the installer again from the same directory.

## Requirements

- A Linux host (or macOS with Docker Desktop) with Docker Engine and Docker Compose v2.
- **HTTPS is required for sign-in**: production session cookies are HTTPS-only, so a sign-in over plain HTTP does not stick. Put a TLS reverse proxy in front (sending `X-Forwarded-Proto: https`), set `CLIENT_ORIGIN` in `.env` to its `https://` address and `FORCE_HTTPS=true`, then run `docker compose up -d` again.
- The technician panel answers on the host name `TECH_PANEL_HOSTNAME` (`.env`): point that name at this panel through your reverse proxy.
- Address geocoding and the map use OpenStreetMap services, so the server needs outbound internet access for them.

## Single sign-on

Oblifield supports single sign-on with [Obligate](https://github.com/obli-tools/Obligate): register Oblifield as an app in Obligate, then enter the Obligate URL and API key in the Oblifield settings. Local accounts keep working alongside SSO.

## Part of the Obli suite

| Tool | Purpose |
|------|---------|
| [Obliance](https://ance.obli.tools) | Remote monitoring and management (RMM) |
| [Oblireach](https://reach.obli.tools) | Remote screen access and remote support |
| [Obliview](https://view.obli.tools) | Uptime and infrastructure monitoring |
| [Oblimap](https://map.obli.tools) | IPAM and network discovery |
| [Obliguard](https://guard.obli.tools) | Agent-based intrusion prevention |
| [Obligate](https://gate.obli.tools) | Single sign-on and access management for the suite |
| [Oblihub](https://hub.obli.tools) | Docker control panel |
| [Obliwan](https://github.com/obli-tools/Obliwan) | WAN router fleet management |
| [ObliDesk](https://github.com/obli-tools/ObliDesk) | Ticketing and service desk |
| [Obliplan](https://github.com/obli-tools/Obliplan) | Workforce scheduling and working-time tracking |
| **[Oblifield](https://field.obli.tools)** | Field intervention management |

Suite home: [obli.tools](https://obli.tools)

## License

Oblifield is source-available under the [Elastic License 2.0](LICENSE) (ELv2). You may use, modify and self-host it, including for commercial use inside your organization; you may not provide it to others as a hosted or managed service. See [LICENSE](LICENSE) for the full terms and the obli.tools clarifications.
