# ADDITIONAL SETUP

## 1. Desktop icon

* Copy `vlctv.desktop` to `~/.local/share/applications/`

## 2. Web server

* Copy `vlctv.service` to `/lib/systemd/system/`

* Enable the service (automatically start on boot and resume if exited):

```bash
sudo systemctl enable vlctv
```

* (To disable the service)

```bash
sudo systemctl enable vlctv
```
