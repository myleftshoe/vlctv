#!/usr/bin/gjs

const { GLib, Gio } = imports.gi;

const home = GLib.get_current_dir()
const path = GLib.build_filenamev([home,  'rrr/testing.txt']);
const file = Gio.File.new_for_path(path)
let [success, tag] = file.replace_contents(`fsdfsdfs
ggggeeg
fsdfsdfs
fsdf
`, null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);



const xml = `<?xml version="1.0" encoding="UTF-8"?>
<playlist xmlns="http://xspf.org/ns/0/" xmlns:vlc="http://www.videolan.org/vlc/playlist/ns/0/" version="1">
	<title>Television</title>
	<trackList>
		<track>
			<title>${name}</title>
			<location>dvb-t://frequency=${frequency}</location>
			<extension application="http://www.videolan.org/vlc/playlist/0">
				<vlc:option>dvb-bandwidth=7</vlc:option>
				<vlc:option>dvb-ts-id=561</vlc:option>
				<vlc:option>dvb-code-rate-hp=3/4</vlc:option>
				<vlc:option>dvb-modulation=64QAM</vlc:option>
				<vlc:option>dvb-transmission=8</vlc:option>
				<vlc:option>dvb-guard=1/16</vlc:option>
				<vlc:id>35</vlc:id>
				<vlc:option>program=562</vlc:option>
			</extension>
		</track>
    </trackList>
</playlist>
`