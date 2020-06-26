
# VLCTV

A free-to-air digitalTV player for linux

## Features

* Watch DVB-T digitalTV in a native linux (gnome) app
* 7-day program guide
* Web interface (to control the player from a web browser)

## Technologies

gtk, gjs, svelte, html, css, js, linux (systemd, unix sockets)

### systemd

/lib/systemd/system/vlctv.service

```ini
[Unit]
Description=vlctv web server
Documentation=https://example.com
After=network.target

[Service]
Environment=NODE_PORT=4001
Type=simple
User=paul
#ExecStart=/usr/bin/node /home/paul/Development/vlctv/web/server.js
WorkingDirectory=/home/paul/Development/vlctv/web
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable the service (automatically start on boot and resume if exited)

```bash
sudo systemctl enable vlctv
```

Disable the service:

```bash
sudo systemctl enable vlctv
```