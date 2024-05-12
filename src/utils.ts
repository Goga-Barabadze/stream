import { TorrentFile } from "webtorrent";

export const videoFileEndings = [".mp4", ".mkv", ".webm", ".ogv", ".mov"]
export const subtitleFileEndings = [".srt"]

export const trackers = [
    "wss://tracker.webtorrent.dev",
    "wss://tracker.files.fm:7073/announce",
    "ws://tracker.files.fm:7072/announce",
    "wss://tracker.openwebtorrent.com",
    "wss://tracker.btorrent.xyz",
    "wss://tracker.fastcast.nz",
    "wss://tracker.sloppyta.co",
]

export function isVideo(file: TorrentFile) {
    return videoFileEndings.some(ending => file.name.endsWith(ending))
}

export function isSubtitle(file: TorrentFile) {
    return subtitleFileEndings.some(ending => file.name.endsWith(ending))
}

export function trackerString() {
    let trackerString = ""

    // trackers.forEach(tracker => {
    //     trackerString = `${trackerString}&tr=${encodeURIComponent(tracker)}`
    // })

    return trackerString
}
