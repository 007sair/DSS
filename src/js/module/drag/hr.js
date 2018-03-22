import tool from '_instance/tool'
import global_data from '_instance/data'
import dom, { el_module, el_view } from "_instance/dom";

class Hr {

    constructor() {

        // 当前模块的容器
        this.$container = null

        // 模块名称，通常与此文件同名
        this.type = 'hr'

        // 模块标题，出现在设置面板的title处
        this.title = '分隔栏'

        this.icon = 'images/m_banner.png'

        // 悬浮操作区
        this.actions = ['setting', 'up', 'dn', 'delete']

        // 当前模块存放的所有数据
        this.data = ko.mapping.fromJS({
            text: '分隔栏',
            color: ''
        })

    }

    html() {
        return `
            <div class="tit">
                <i class="icon-close" data-bind="click:close"></i>${this.title}
            </div>
            <div class="content">
                <div class="dss-form-item">
                    <label class="form-label form-label-5 required">分隔栏文字</label>
                    <div class="form-box">
                        <input type="text" data-bind="value:data.text,valueUpdate:'afterkeydown'" class="form-input" placeholder="填入名称">
                    </div>
                </div>
                <div class="dss-form-item">
                    <label class="form-label form-label-5">分隔栏颜色</label>
                    <div class="form-box">
                        <div class="color-picker">
                            <input id="_colorpicker_" data-bind="value: data.color" type="text" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="btns">
                <button type="button" data-bind="click:save,disable:!data.text()" class="btn btn-primary">保存</button>
            </div>
        `
    }

    // 创建模块元素，插入dom中
    create() {
        let self = this
        let offset = dom.getOffset(dom.$action)
        let id = dom.$activeView.attr('id')
        
        this.$container = $(`
            <div class="dss-dialog dss-dialog-${this.type}">${this.html()}</div>
        `).css({
            top: offset.top,
            left: offset.left,
        }).appendTo($(document.body))
        
        // 数据发生变更，需再次mapping
        this.data = ko.mapping.fromJS(Object.assign({}, this.data, global_data.store.data[id]))

        console.log(this.data);

        // 设置色板
        this.setColor()

        // 双向绑定
        ko.applyBindings(this, this.$container[0])

        // 必须返回，否则外部接收不到，无法删除
        return this.$container
    }

    setColor() {
        let self = this
        let $colorPicker = this.$container.find('#_colorpicker_')
        let colorPicker_config = Object.assign({}, global_data.colorPicker, {
            color: self.data.color() || '#333',
            change: function(color) {
                self.data.color(color.toHexString())
            }
        })
        $colorPicker.spectrum(colorPicker_config).show()

        let curColor = $colorPicker.spectrum("get");
        this.data.color(curColor.toHexString())
    }

    save() {
        let self = this
        let id = dom.$activeView.attr('id')

        let idx = tool.startLoading()
        setTimeout(() => {
            self.destroy()
            layer.msg('保存成功', { icon: 1, time: 1500 });
            layer.close(idx)
            global_data.store.data[id] = ko.mapping.toJS(this.data);
            
            // 渲染view预览区 更新本地存储
            self.renderViewHtml()
        }, 500);
    }

    destroy() {
        global_data.isSettingPanelShow = false
    }

    // 拖拽后的临时占位图
    // 调用时机：成功拖拽到view区时
    getTempHtml() {
        return `
            <div class="temp-hr">
                <i></i><span>分隔栏</span><i></i>
            </div>
        `
    }

    // 将html保存到view区
    // 调用时机：点击设置面板区的"保存"按钮
    renderViewHtml($el = dom.$activeView) {
        let obj = ko.mapping.toJS(this.data)
        let html = `
            <div class="temp-hr" style="color:${obj.color}">
                <i></i><span>${obj.text}</span><i></i>
            </div>
        `
        $el.html(html)

        // 触发 store.set() 保存数据到本地
        // 在这之前必须先处理好global_data.store的数据，否则无法保存
        global_data.isDomUpdate = true
    }

}

export default Hr