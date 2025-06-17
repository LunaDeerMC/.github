import { defineThemeConfig } from 'vuepress-theme-plume'
import navbar from './navbar'
import notes from './notes'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: '/logo.png',

  appearance: true,  // 配置 深色模式

  social: [
    { icon: 'github', link: 'https://github.com/LunaDeerMC' },
  ],

  copyright: true,

  // prevPage: true,   // 是否启用上一页链接
  // nextPage: true,   // 是否启用下一页链接
  // createTime: true, // 是否显示文章创建时间

  /* 站点页脚 */
  // footer: {
  //   message: 'Power by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>',
  //   copyright: '',
  // },

  /**
   * @see https://theme-plume.vuejs.press/config/basic/#profile
   */
  profile: {
    avatar: '/logo.png',
    name: 'LunaDeerMC',
    description: 'To the Moon! To the Dream! To the Future!',
  },

  navbar,
  notes,

  /**
   * 公告板
   * @see https://theme-plume.vuejs.press/guide/features/bulletin/
   */
  // bulletin: {
  //   layout: 'top-right',
  //   contentType: 'markdown',
  //   title: '公告板标题',
  //   content: '公告板内容',
  // },

  transition: {
    page: true,        // 启用 页面间跳转过渡动画
    appearance: 'fade',  // 启用 深色模式切换过渡动画, 或配置过渡动画类型
  },

})
