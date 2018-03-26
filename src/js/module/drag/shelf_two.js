import global_data from '_instance/data'
import tool from '_instance/tool'
import dom, { el_module, el_view } from "_instance/dom";

class ShelfTwo {

    constructor() {

        // 当前模块的容器
        this.$container = null

        // 模块名称，通常与此文件同名
        this.type = 'shelf_two'

        // 模块标题，出现在设置面板的title处
        this.title = '两列货架'

        this.icon = 'images/m_banner.png'

        // 悬浮操作区
        this.actions = ['setting','up', 'dn', 'delete']

        // 当前模块存放的所有数据
        this.data = {
            id: '', // 当前模块的id
            isChildSaved: false, // 子模块是否保存
            shelf_title: '',
            items: [],
        }

        // view区显示的最大个数
        this.showMax = 2;
        
    }

    html() {
        return `
            <div class="tit">
                <i class="icon-close" data-bind="click: destroy"></i>${this.title}
            </div>
            <div class="content">
                <div class="dss-form-item">
                    <label class="form-label form-label-4 required">货架名称</label>
                    <div class="form-box">
                        <input type="text" data-bind="value: data.shelf_title, valueUpdate:'afterkeydown'" class="form-input" placeholder="填入名称">
                    </div>
                </div>
                <button data-bind="click: showModify" class="modify-shelf">编辑货架商品</button>
            </div>
            <div class="btns">
                <button type="button" data-bind="click:save, disable: !data.shelf_title()" class="btn btn-primary">保存</button>
            </div>
        `
    }

    // 创建模块元素，插入dom中
    // 创建一个双向数据绑定 jquery.my.js
    create() {
        let self = this
        let id = dom.$activeView.attr('id')
        let offset = dom.getOffset(dom.$action)

        this.data = ko.mapping.toJS(this.data)

        this.$container = $(`
            <div class="dss-dialog dss-dialog-${this.type}">${this.html()}</div>
        `).css({
            top: offset.top,
            left: offset.left,
        }).appendTo($(document.body))

        // 从本地存储的global_data中获取到本条数据
        this.data = ko.mapping.fromJS(Object.assign({}, this.data, global_data.store.data[id]))

        // 初始化状态为红色
        this.data.isChildSaved(false)

        // 双向绑定
        ko.applyBindings(this, this.$container[0])

        return this.$container
    }

    // 显示编辑货架弹层
    showModify() {
        let modify_shelf = dom.getModule('modify_shelf')
        modify_shelf.create(this)
    }

    save() {
        let self = this
        let idx = tool.startLoading()
        setTimeout(() => {
            self.data.id(tool.guid())
            self.destroy()
            layer.msg('保存成功', { icon: 1, time: 1500 });
            layer.close(idx)

            // 渲染view预览区 更新本地存储
            self.renderViewHtml()
            // 将数据和dom存储在本地
            self.saveStore()
        }, 500);
    }

    saveStore() {
        let id = dom.$activeView.attr('id')
        global_data.store.data[id] = ko.mapping.toJS(this.data);

        // 触发 store.set() 保存数据到本地
        // 在这之前必须先处理好global_data.store的数据，否则无法保存
        global_data.isDomUpdate = true
    }

    destroy() {
        global_data.isSettingPanelShow = false
    }

    // 拖拽成功后的临时占位图
    // 调用时机：成功拖拽到view区时
    getTempHtml() {
        let lis = ''
        for (let i = 0; i < this.showMax; i++) {
            lis += `<li></li>`
        }
        return `
            <div class="temp-${this.type}">
                <ul>${ lis }</ul>
            </div>
        `
    }

    // 将html保存到view区
    // 调用时机：点击设置面板区的"保存"按钮
    renderViewHtml($el = dom.$activeView) {
        let obj = ko.mapping.toJS(this.data)
        let items = obj.items.slice(0)
        let html = ''

        if (items.length) {
            items.length = items.length >= this.showMax ? this.showMax : items.length
            items.forEach(item => {
                html += `
                    <div class="defaultBlock">
                        <div class="entranceMap">
                            <img src="${item.img}">
                        </div>
                        <div class="rim">
                            <div class="mainTitle">${item.title}</div>
                            <div class="price">
                                <div class="sp">${item.sp}</div>
                            </div>
                        </div>
                    </div>
                `
            })
        } else {
            html = this.getTempHtml()
        }
        $el.html(html)
    }

}

export default ShelfTwo
