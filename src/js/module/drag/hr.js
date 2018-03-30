import gd from '@instance/data'
import tool from '@instance/tool'
import _store from '@instance/store'

class Hr {

    constructor() {

        // 当前模块的容器
        this.el = null

        // 模块名称，通常与此文件同名
        this.type = 'hr'

        // 模块标题，出现在设置面板的title处
        this.title = '分隔栏'

        this.icon = 'images/m_hr.png'

        // 悬浮操作区
        this.actions = ['setting', 'up', 'dn', 'delete']

        this.data = {
            text: '分隔栏',
            color: ''
        }

        this.bind()
        
    }

    getHtml() {
        return `
            <div class="tit">
                <i class="icon-close" data-bind="click:destroy"></i>${this.title}
            </div>
            <div class="content">
                <div class="dss-form-item">
                    <label class="form-label form-label-5 required">分隔栏文字</label>
                    <div class="form-box">
                        <input type="text" data-bind="value:bindData.text,valueUpdate:'afterkeydown'" class="form-input" placeholder="填入名称">
                    </div>
                </div>
                <div class="dss-form-item">
                    <label class="form-label form-label-5">分隔栏颜色</label>
                    <div class="form-box">
                        <div class="color-picker">
                            <input id="_colorpicker_" data-bind="value: bindData.color" type="text" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="btns">
                <button type="button" data-bind="click:save,disable:!bindData.text()" class="btn btn-primary">保存</button>
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

        // 设置色板
        this.setColor()

        // 双向绑定
        ko.applyBindings(this, this.el)

        // 必须返回，否则外部接收不到，无法删除
        return this.el
    }

    setColor() {
        let self = this
        let $colorPicker = $(this.el).find('#_colorpicker_')
        let colorPicker_config = Object.assign({}, gd.colorPicker, {
            color: self.bindData.color() || '#7f8797',
            change: function(color) {
                self.bindData.color(color.toHexString())
            }
        })
        $colorPicker.spectrum(colorPicker_config).show()

        let curColor = $colorPicker.spectrum("get");
        this.bindData.color(curColor.toHexString())
    }

    save() {
        this.data = ko.mapping.toJS(this.bindData)
        this.html(this.getViewHtml())
        this.destroy()
        gd.$$preview.updataNav()
        _store.set()
    }

    destroy() {
        $(this.el).remove()
        gd.$$action && gd.$$action.isShowPanel(false)
    }

    // 渲染view区
    // 有数据就渲染带数据的 没有就渲染占位
    getViewHtml() {
        let isEmpty = () => {
            return !this.data.text
        }
        let html = ''

        if (!isEmpty()) {
            html = `
                <div class="temp-hr" style="color:${ this.data.color }">
                    <i></i><span>${ this.data.text }</span><i></i>
                </div>`
        } else {
            html = `
                <div class="temp-hr">
                    <i></i><span>分隔栏</span><i></i>
                </div>`
        }

        return html
    }

}

export default Hr