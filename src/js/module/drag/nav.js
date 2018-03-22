import global_data from '_instance/data'
import tool from '_instance/tool'
import dom, { el_module, el_view } from "_instance/dom";

class Nav {

    constructor() {

        // 当前模块的容器
        this.$container = null

        // 模块名称，通常与此文件同名
        this.type = 'nav'

        // 模块标题，出现在设置面板的title处
        this.title = '一键生成导航'

        this.icon = 'images/m_banner.png'

        // 悬浮操作区
        this.actions = ['delete']

        // 当前模块存放的所有数据
        this.data = {
            nav: []
        }
    }

    html() {
        return `
        `
    }
    
    update(callback) {
        if (typeof callback !== 'function') {
            return false
        }
        callback && callback(this.data)
    }

    // 创建模块元素，插入dom中
    // 创建一个双向数据绑定 jquery.my.js
    create() {

    }

    // 拖拽后的临时占位图
    // 调用时机：成功拖拽到view区时
    getTempHtml() {
        return `
            <div class="temp-nav">导航占位</div>
        `
    }

    // 将html保存到view区
    // 调用时机：点击设置面板区的"保存"按钮
    renderViewHtml($el = dom.$activeView) {
        let html = '';
        if (this.data.nav.length) {
            let lis = ''
            this.data.nav.forEach(nav => {
                lis += `<li><span>${nav.title}</span></li>`
            })
            html = `<ul>${lis}</ul>`
        } else {
            html = '<div class="empty-nav">导航内没有数据，请添加模块</div>'
        }
        
        $el.html(html)
    }
}

export default Nav
