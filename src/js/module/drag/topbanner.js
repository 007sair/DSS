import tool from '@instance/tool'
import _store from '@instance/store'
import gd from '@instance/data'

class TopBanner {

    constructor() {

        // 当前模块的容器
        this.el = null

        // 模块名称，通常与此文件同名
        this.type = 'topbanner'

        // 模块标题，出现在设置面板的title处
        this.title = '专题头图'

        this.icon = 'images/m_banner.png'

        // 悬浮操作区
        this.actions = ['setting', 'delete']

        this.data = {
            src: ''
        }

        this.bind()
    }

    getHtml() {
        return `
            <div class="tit">
                <i class="icon-close" data-bind="click:destroy"></i>${this.title}
            </div>
            <div class="content">
                <p class="mt15 f12 c-gray-l">
                    <span class="c-theme">*</span> 建议图片宽度<1000，高150-1500，支持jpg、png格式
                </p>
                <div class="upload">
                    <span class="icon" data-bind="visible: !bindData.src()">添加图片</span>
                    <img data-bind="visible:bindData.src(), attr:{src:bindData.src}">
                    <input data-bind="event: { change: function() { uploadImage($element.files[0]) } }" type="file" name="files[]" multiple>
                </div>
            </div>
            <div class="btns">
                <button type="button" data-bind="click:save" class="btn btn-primary">保存</button>
            </div>
        `
    }

    bind() {
        this.bindData = ko.mapping.fromJS(tool.jsonClone(this.data))
    }

    // 创建模块元素，插入dom中
    create(offset) {
        this.el = document.createElement('div')
        this.el.className = `dss-dialog dss-dialog-${this.type}`
        this.el.style.left = offset.left + 'px'
        this.el.style.top = offset.top + 'px'
        this.el.innerHTML = this.getHtml()

        document.body.appendChild(this.el)

        this.bind()

        // 双向绑定
        ko.applyBindings(this, this.el)

        return this.el
    }

    save() {
        this._html(this.getViewHtml())
        this.destroy()
        _store.set()
    }

    uploadImage(file) {
        tool.requestUpload(file, (res) => {
            this.bindData.src(res.url)
        })
    }

    destroy() {
        $(this.el).remove()
        gd.$$action && gd.$$action.isShowPanel(false)
    }

    // 渲染view区
    // 有数据就渲染带数据的 没有就渲染占位
    getViewHtml() {
        this.data = ko.mapping.toJS(this.bindData)
        let isEmpty = () => {
            return !this.data.src
        }
        let html = ''

        if (!isEmpty()) {
            html = `<img src="${ this.data.src }" />`
        } else {
            html = `<div class="temp-topbanner"></div>`
        }

        return html
    }

}

export default TopBanner
