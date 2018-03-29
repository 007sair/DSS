import gd from '@instance/data'
import tool from '@instance/tool'

class Nav {

    constructor() {

        // 当前模块的容器
        this.el = null

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

    bind() {
        // this.bindData = ko.mapping.fromJS(this.data)
    }

    getViewHtml() {
        let html = ''
        let arr = this.data.nav
        if (arr.length) {
            let lis = ''
            arr.forEach(data => {
                lis += `<li><span>${data.data.text}</span></li>`
            })
            html = `<ul>${lis}</ul>`
        } else {
            html = '<div class="empty-nav">导航内没有数据，请添加模块</div>'
        }
        return html
    }
    
    destroy() {

    }
   
}

export default Nav
