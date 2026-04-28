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
      { text: 'ReColorfulMap', link: '/amusing/ReColorfulMap/' },
      { text: 'CompassTeleport', link: '/amusing/CompassTeleport/' },
      { text: 'ExpExtraction', link: '/amusing/ExpExtraction/' },
      { text: 'LiteWorldEdit', link: '/amusing/LiteWorldEdit/' },
    ]
  },
  {
    text: '🍃服务端核心',
    items: [
      { text: '【原版优化】DeerFolia', link: '/core/DeerFolia/' },
      { text: '【更多功能】DeerFoliaPlus', link: '/core/DeerFoliaPlus/' },
    ]
  },
  {
    text: '💎付费插件',
    items: [
      { text: '【保护记录】DominionProtect', link: '/paid/DominionProtect/' },
      { text: '购买说明', link: '/paid/buy/' },
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
