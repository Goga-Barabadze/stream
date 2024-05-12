const trackers = [
    'udp://tracker.internetwarriors.net:1337/announce',
    'udp://tracker.opentrackr.org:1337/announce',
    'udp://p4p.arenabg.ch:1337/announce',
    'udp://tracker.openbittorrent.com:6969/announce',
    'udp://www.torrent.eu.org:451/announce',
    'udp://tracker.torrent.eu.org:451/announce',
    'udp://retracker.lanta-net.ru:2710/announce',
    'udp://open.stealth.si:80/announce',
    'udp://exodus.desync.com:6969/announce',
    'udp://tracker.tiny-vps.com:6969/announce'
]

fetch("https://eztv.re/search/hey").then(value => {
    console.log(value.text())
})
