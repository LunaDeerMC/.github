import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: '🏠首页', link: '/' },
  {
    text: '⭐高级插件',
    items: [
      { text: '【领地】Dominion', link: 'https://dominion.lunadeer.cn/' },
      { text: '【家具】FurnitureCore', link: 'https://furniturecore.lunadeer.cn/' },
    ]
  },
  {
    text: '🎉趣味插件',
    items: [
      { text: 'ReColorfulMap', link: '/notes/amusing/ReColorfulMap.md' },
      { text: 'CompassTeleport', link: '/notes/amusing/CompassTeleport.md' },
      { text: 'ExpExtraction', link: '/notes/amusing/ExpExtraction.md' },
      { text: 'LiteWorldEdit', link: '/notes/amusing/LiteWorldEdit/' },
    ]
  },
  {
    text: '🍃服务端核心',
    items: [
      { text: '【原版优化】DeerFolia', link: '/notes/core/DeerFolia/' },
      { text: '【更多功能】DeerFoliaPlus', link: '/notes/core/DeerFoliaPlus/' },
    ]
  },
  {
    text: '💬交流',
    items: [
      { text: 'QQ 群', link: 'https://qm.qq.com/q/J8FeUtpEIM' },
      { text: 'Discord 服务器', link: 'https://discord.gg/XuU7rwyN' },
    ]
  },
])
