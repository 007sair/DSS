/**
 * 导出模块对象，对象包含所有子模块
 * 导出左侧模块配置信息，外部使用map接收
 * ---------------------------
 * 创建新模块步骤：
 * 1. 在对应目录下创建js文件，如：src/js/module/drag/topbanner.js
 * 2. 引入模块，在config对象中调用
 * 3. 导出模块，供外部使用
 */

/* 拖拽模块 */
import topbanner from '@module/drag/topbanner'
import hr from '@module/drag/hr'
import nav from '@module/drag/nav'
import shelf_two from '@module/drag/shelf_two'
import shelf_three from '@module/drag/shelf_three'

/* 页面弹层模块 */
import global_set from '@module/pop/global_set'
import modify_shelf from '@module/pop/modify_shelf'
import create_page from '@module/pop/create_page'

// 左侧模块数据
let config = [
    {
        name: 'images',
        title: '图片类',
        child: [
            new hr(),
            new topbanner()
        ]
    },
    {
        name: 'shelfs',
        title: '商品货架',
        child: [
            new shelf_two(),
            new shelf_three()
        ]
    },
    {
        name: 'dividerNav',
        title: '分隔导航',
        child: [
            new nav(),
        ]
    },
]

export let map = config
export default {
    // drag
    hr, 
    topbanner, 
    nav,
    shelf_two,
    shelf_three,

    // page
    global_set,
    modify_shelf,
    create_page
}