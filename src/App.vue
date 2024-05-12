<script setup lang="ts">
import WebTorrent, { Torrent, TorrentFile } from 'webtorrent'
import { computed, ref } from "vue";
import { isSubtitle, isVideo, subtitleFileEndings, trackerString, videoFileEndings } from "./utils.ts";
import { TextTrack } from "video.js";

const client = new WebTorrent()

const files = ref<TorrentFile[]>([])
const textTracks = ref<TextTrack[]>([])

// const magnet = ref('magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent')
// const magnet = ref(`magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Croods&${trackerString()}&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent`)
// const magnet = ref(`magnet:?xt=urn:btih:BCW2LJ5GDA5K4HQJ3AY56Z2I2VTASWQQ&dn=Sintel&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969`)
const magnet = ref()
const player = computed(() => document.querySelector('video'))

navigator.serviceWorker.register('sw.min.js', { scope: './' }).then(reg => {
  const worker = reg.active || reg.waiting || reg.installing
  function checkState (worker: any) {
    return worker.state === 'activated' && client.createServer({ controller: reg }) && download()
  }
  if (!checkState(worker)) {
    worker?.addEventListener('statechange', ({ target }) => checkState(target))
  }
})

function download() {
  const currentTorrent = client.torrents.at(0)

  if (currentTorrent != null) {
    client.remove(currentTorrent.magnetURI).then(download) // recall, recursive
  } else {
    addTorrent()
  }
}

function addTorrent() {
  console.log(client)
  client.add(magnet.value, (torrent: Torrent) => {
    files.value = sortFiles(torrent.files)

    const videoFile = torrent.files.find((file: TorrentFile) => file.name.endsWith('.mp4'))
    videoFile.streamTo(player.value)

    textTracks.value = []
    torrent.files.forEach((file: TorrentFile) => {
      if (!isSubtitle(file)) return

      textTracks.value.push(file)
      fetch(file.streamURL)
    })

    player.value!.muted = true
    player.value?.play()
  })
}

function sortFiles(files: TorrentFile[]): TorrentFile[] {
  return files.sort((a, b) => {
    const aIsVideo = videoFileEndings.some(ending => a.name.endsWith(ending))
    const bIsVideo = videoFileEndings.some(ending => b.name.endsWith(ending))

    const aIsSubtitle = subtitleFileEndings.some(ending => a.name.endsWith(ending))
    const bIsSubtitle = subtitleFileEndings.some(ending => b.name.endsWith(ending))

    if ((aIsVideo && bIsVideo) || (aIsSubtitle && bIsSubtitle)) {
      return a.name - b.name
    }

    if (aIsVideo && !bIsVideo) {
      return 1
    }

    if (aIsSubtitle && !bIsVideo && !bIsSubtitle) {
      return 1
    }

    return a.name - b.name
  })
}

function clickedOnFile(file: TorrentFile) {
  if (isVideo(file)) {
    file.streamTo(player)
  }

  if (isSubtitle(file)) {
    // TODO get language from subtitle file
    console.log(player.value!.textTracks)
  }
}
</script>

<template>
  <video
      id="video-container"
      class="video-js"
      :data-setup="{}"
      :controls="true"
  >
    <track
        v-for="track in textTracks"
        :src="track.streamURL"
        kind="subtitles"
        :label="track.name"
        default
        srclang="en"
    />
  </video>

  <br>

  <div class="m-5">
    <div class="text-right">
      <button type="button">
        Search
      </button>
    </div>

    <br>

    <h2 class="text-3xl font-extrabold dark:text-white">
      Files
    </h2>

    <div class="w-fulltext-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      <button
          v-for="file in files"
          @click="clickedOnFile(file)"
          type="button"
          class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
      >
        {{ file.name }}
      </button>
    </div>
  </div>

</template>

<style scoped>
#video-container {
  width: 100%;
  height: 50%;
}
</style>
