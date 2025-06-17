import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

const amusing = defineNoteConfig(
  {
    dir: 'amusing',
    link: '/amusing',
    sidebar: 'auto',
  }
)

const coreDeerFolia = defineNoteConfig(
  {
    dir: 'core/DeerFolia',
    link: '/core/DeerFolia',
    sidebar: 'auto',
  }
)

const coreDeerFoliaPlus = defineNoteConfig(
  {
    dir: 'core/DeerFoliaPlus',
    link: '/core/DeerFoliaPlus',
    sidebar: 'auto',
  }
)

export default defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [amusing, coreDeerFolia, coreDeerFoliaPlus],
})
