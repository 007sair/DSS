import global_data from '_instance/data'
import tool from '_instance/tool'
import dom, { el_module, el_view } from "_instance/dom";

class TopBanner {

    constructor() {

        // 当前模块的容器
        this.$container = null

        // 模块名称，通常与此文件同名
        this.type = 'topbanner'

        // 模块标题，出现在设置面板的title处
        this.title = '专题头图'

        this.icon = 'images/m_banner.png'

        // 悬浮操作区
        this.actions = ['setting', 'delete']

        this.src = ko.observable('')
    }

    html() {
        return `
            <div class="tit">
                <i class="icon-close" data-bind="click:destroy"></i>${this.title}
            </div>
            <div class="content">
                <p class="mt15 f12 c-gray-l">
                    <span class="c-theme">*</span> 建议图片宽度<1000，高150-1500，支持jpg、png格式
                </p>
                <div class="upload">
                    <span class="icon" data-bind="visible: !src()">添加图片</span>
                    <img data-bind="visible: src(), attr: { src:src }">
                    <input data-bind="event: { change: function() { uploadImage($element.files[0]) } }" type="file" name="files[]" multiple>
                </div>
            </div>
            <div class="btns">
                <button type="button" data-bind="click: save" class="btn btn-primary">保存</button>
            </div>
        `
    }

    // 创建模块元素，插入dom中
    create() {
        let self = this
        let id = dom.$activeView.attr('id')
        let offset = dom.getOffset(dom.$action)

        this.$container = $(`
            <div class="dss-dialog dss-dialog-${this.type}">${this.html()}</div>
        `).css({
            top: offset.top,
            left: offset.left,
        }).appendTo($(document.body))

        // 数据发生变更，需再次mapping
        this.data = ko.mapping.fromJS(Object.assign({}, this.data, global_data.store.data[id]))

        // 双向绑定
        ko.applyBindings(this, this.$container[0])

        return this.$container
    }

    save() {
        let self = this
        let id = dom.$activeView.attr('id')

        let idx = tool.startLoading()
        setTimeout(() => {
            self.destroy()
            global_data.isDomUpdate = true
            layer.msg('保存成功', { icon: 1, time: 1500 });
            layer.close(idx)
            global_data.store.data[id] = ko.mapping.toJS(this.data);

            // 触发 store.set() 保存数据到本地
            // 在这之前必须先处理好global_data.store的数据，否则无法保存
            global_data.isDomUpdate = true

            // 渲染view预览区
            self.renderViewHtml()
            
        }, 500);
    }

    uploadImage(file) {
        tool.requestUpload(file, (res) => {
            this.src(res.url)
        })
    }

    destroy() {
        global_data.isSettingPanelShow = false
    }

    // 拖拽成功后的临时占位图
    // 调用时机：成功拖拽到view区时
    getTempHtml() {
        return `
            <div class="temp-topbanner"></div>
        `
    }

    // 将html保存到view区
    // 调用时机：点击设置面板区的"保存"按钮
    renderViewHtml($el = dom.$activeView) {
        // 需转换成原始对象
        let html = `
            <img src="${ ko.toJS(this.src) }" />
        `
        $el.html(html)
    }

}

export default TopBanner
