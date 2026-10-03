/**
 * Each entry becomes a bot command via commands/prexzy/dynamic.js.
 * Param names are best-guess based on common API conventions (q, text, username, url) —
 * since the interactive docs are a JS app I can't click through, test each one live and
 * adjust `paramName` below if a specific endpoint expects something different
 * (check the endpoint's own page at https://docs.prexzyapis.com for the exact param).
 *
 * NOT included: anything under "Downloader APIs" (TikTok/YouTube/Instagram/Spotify/SoundCloud
 * media downloads — copyrighted content), the adult-oriented image-generation checkpoints
 * (PornMaster, BigBellyBabes, No Skinny Chicks), and the nationality-tagged "random girl"
 * image endpoints.
 */

module.exports = [
  // ---- Stalk / lookup ----
  {
    name: 'ffstalk',
    category: 'stalk',
    description: 'Look up a Free Fire account: .ffstalk <uid>',
    path: '/stalk/ffstalk',
    paramName: 'id',
    usage: '.ffstalk <uid>',
  },
  {
    name: 'igstalk',
    category: 'stalk',
    description: 'Look up an Instagram account: .igstalk <username>',
    path: '/stalk/igstalkV2',
    paramName: 'username',
    usage: '.igstalk <username>',
  },
  {
    name: 'ytstalk',
    category: 'stalk',
    description: 'Look up a YouTube channel: .ytstalk <@handle>',
    path: '/stalk/ytstalk',
    paramName: 'user',
    usage: '.ytstalk <@handle>',
  },

  // ---- Search ----
  {
    name: 'yts',
    aliases: ['ytsearch'],
    category: 'search',
    description: 'Search YouTube: .yts <query>',
    path: '/search/youtube',
    paramName: 'q',
    usage: '.yts <search query>',
  },
  {
    name: 'tiktoksearch',
    category: 'search',
    description: 'Search TikTok: .tiktoksearch <query>',
    path: '/search/tiktoksearch',
    paramName: 'q',
    usage: '.tiktoksearch <search query>',
  },
  // NOTE: .lyrics (/search/lyrics) intentionally left out — it returns full song lyrics
  // text, which is the same copyright issue as the music downloader, just in text form.
  {
    name: 'imdb',
    category: 'search',
    description: 'Search IMDb: .imdb <movie/show name>',
    path: '/search/imdb',
    paramName: 'q',
    usage: '.imdb <title>',
  },
  {
    name: 'ghrepo',
    category: 'search',
    description: 'Search GitHub repositories: .ghrepo <query>',
    path: '/search/repos',
    paramName: 'q',
    usage: '.ghrepo <query>',
  },
  {
    name: 'ghuser',
    category: 'search',
    description: 'Search GitHub users: .ghuser <query>',
    path: '/search/users',
    paramName: 'q',
    usage: '.ghuser <query>',
  },
  {
    name: 'wallpaper',
    category: 'search',
    description: 'Search HD wallpapers: .wallpaper <query>',
    path: '/search/wallpaper',
    paramName: 'q',
    usage: '.wallpaper <query>',
    resultHint: 'image',
  },
  {
    name: 'pinsearch',
    category: 'search',
    description: 'Search Pinterest images: .pinsearch <query>',
    path: '/search/pinterest',
    paramName: 'q',
    usage: '.pinsearch <query>',
    resultHint: 'image',
  },

  // ---- Tools ----
  {
    name: 'geoip',
    category: 'tools',
    description: 'Look up geolocation for an IP: .geoip <ip>',
    path: '/tools/geoip',
    paramName: 'ip',
    usage: '.geoip <ip address>',
  },
  {
    name: 'myip',
    category: 'tools',
    description: "Get the bot server's own IP geolocation",
    path: '/tools/myip',
    usage: '.myip',
  },
  {
    name: 'detectlang',
    category: 'tools',
    description: 'Detect the language of text: .detectlang <text>',
    path: '/tools/detectlanguage',
    paramName: 'text',
    usage: '.detectlang <text>',
  },
  {
    name: 'entoid',
    category: 'tools',
    description: 'Translate English to Indonesian: .entoid <text>',
    path: '/tools/entoid',
    paramName: 'text',
    usage: '.entoid <text>',
  },
  {
    name: 'idtoen',
    category: 'tools',
    description: 'Translate Indonesian to English: .idtoen <text>',
    path: '/tools/idtoen',
    paramName: 'text',
    usage: '.idtoen <text>',
  },
  {
    name: 'shorten',
    aliases: ['shortlink'],
    category: 'tools',
    description: 'Shorten a URL: .shorten <url>',
    path: '/tools/vgd',
    paramName: 'url',
    usage: '.shorten <url>',
  },
  {
    name: 'runcode',
    aliases: ['compile'],
    category: 'tools',
    description: 'Compile/run code: .runcode <language> <code>',
    path: '/tools/compiler',
    usage: '.runcode <language> <code>',
    custom: 'compiler', // handled specially, see dynamic.js
  },

  // ---- Style text ----
  {
    name: 'smallcaps',
    category: 'style',
    description: 'Convert text to small caps: .smallcaps <text>',
    path: '/tools/smallcaps',
    paramName: 'text',
    usage: '.smallcaps <text>',
  },
  {
    name: 'mathbold',
    category: 'style',
    description: 'Convert text to math bold style: .mathbold <text>',
    path: '/tools/mathbold',
    paramName: 'text',
    usage: '.mathbold <text>',
  },
  {
    name: 'reversed',
    category: 'style',
    description: 'Reverse text: .reversed <text>',
    path: '/tools/reversed',
    paramName: 'text',
    usage: '.reversed <text>',
  },
  {
    name: 'allstyles',
    category: 'style',
    description: 'Generate all text styles at once: .allstyles <text>',
    path: '/tools/allstyles',
    paramName: 'text',
    usage: '.allstyles <text>',
  },

  // ---- TTS ----
  {
    name: 'tts',
    category: 'tts',
    description: 'Text to speech (default English voice): .tts <text>',
    path: '/tts/tts-en',
    paramName: 'text',
    usage: '.tts <text>',
    resultHint: 'audio',
  },
  {
    name: 'ttsvoices',
    category: 'tts',
    description: 'List all available TTS voices',
    path: '/tts/tts-voices',
    usage: '.ttsvoices',
  },

  // ---- Anime / Manga ----
  {
    name: 'animesearch',
    category: 'anime',
    description: 'Search for anime: .animesearch <title>',
    path: '/anime/animesearch',
    paramName: 'q',
    usage: '.animesearch <title>',
  },
  {
    name: 'animedetail',
    category: 'anime',
    description: 'Get anime details: .animedetail <id/url>',
    path: '/anime/animedetail',
    paramName: 'id',
    usage: '.animedetail <id>',
  },
  {
    name: 'mangasearch',
    category: 'anime',
    description: 'Search for manga: .mangasearch <title>',
    path: '/anime/manga-search',
    paramName: 'q',
    usage: '.mangasearch <title>',
  },

  // ---- Movies ----
  {
    name: 'moviesearch',
    category: 'movies',
    description: 'Search for a movie: .moviesearch <title>',
    path: '/moviesearch',
    paramName: 'q',
    usage: '.moviesearch <title>',
  },
  {
    name: 'trending',
    category: 'movies',
    description: 'Get trending movies',
    path: '/trending',
    usage: '.trending',
  },

  // ---- Games ----
  {
    name: 'quiz',
    category: 'games',
    description: 'Get a random quiz question',
    path: '/game/quizrandom',
    usage: '.quiz',
  },
  {
    name: 'truefalse',
    category: 'games',
    description: 'Get a true/false quiz question',
    path: '/game/quiztruefalse',
    usage: '.truefalse',
  },

  // ---- Sports ----
  {
    name: 'football',
    category: 'sports',
    description: 'Get live football scores/schedules',
    path: '/sports/football',
    usage: '.football',
  },
  {
    name: 'basketball',
    category: 'sports',
    description: 'Get live basketball scores/schedules',
    path: '/sports/basketball',
    usage: '.basketball',
  },

  // ---- AI ----
  {
    name: 'ai',
    aliases: ['ask'],
    category: 'ai',
    description: 'Chat with an AI: .ai <message>',
    path: '/ai/ch',
    paramName: 'q',
    usage: '.ai <message>',
  },
  {
    name: 'dream',
    category: 'ai',
    description: 'Interpret a dream: .dream <description>',
    path: '/ai/dream',
    paramName: 'q',
    usage: '.dream <description>',
  },
  {
    name: 'story',
    category: 'ai',
    description: 'Generate a quick short story: .story <prompt>',
    path: '/ai/quick',
    paramName: 'q',
    usage: '.story <prompt>',
  },

  // ---- Safe random images ----
  {
    name: 'cat',
    category: 'random',
    description: 'Random cat image',
    path: '/random/cat',
    usage: '.cat',
    resultHint: 'image',
  },
  {
    name: 'dog',
    category: 'random',
    description: 'Random dog image',
    path: '/random/dog',
    usage: '.dog',
    resultHint: 'image',
  },
  {
    name: 'car',
    category: 'random',
    description: 'Random car image',
    path: '/random/car',
    usage: '.car',
    resultHint: 'image',
  },
  {
    name: 'waifu',
    category: 'random',
    description: 'Random SFW anime-style image',
    path: '/random/waifu',
    usage: '.waifu',
    resultHint: 'image',
  },
];
