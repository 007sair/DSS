import tool from '@instance/tool'
import _store from '@instance/store'
import Mod from '@module'
import gd from '@instance/data'

class ShelfTwo {

    constructor() {

        // 当前模块的容器
        this.el = null

        // 模块名称，通常与此文件同名
        this.type = 'shelf_two'

        // 模块标题，出现在设置面板的title处
        this.title = '两列货架'

        this.icon = 'images/m_shelf_two.png'

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

        this.bind()
        
    }

    getHtml() {
        return `
            <div class="tit">
                <i class="icon-close" data-bind="click: destroy"></i>${this.title}
            </div>
            <div class="content">
                <div class="dss-form-item">
                    <label class="form-label form-label-4 required">货架名称</label>
                    <div class="form-box">
                        <input type="text" data-bind="value: bindData.shelf_title, valueUpdate:'afterkeydown'" class="form-input" placeholder="填入名称">
                    </div>
                </div>
                <button data-bind="click: showModify" class="modify-shelf">编辑货架商品</button>
            </div>
            <div class="btns">
                <button type="button" data-bind="click:save, disable: !bindData.shelf_title()" class="btn btn-primary">保存</button>
            </div>
        `
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

        // 初始化状态为红色
        this.bindData.isChildSaved(false)

        // 双向绑定
        ko.applyBindings(this, this.el)

        return this.el
    }

    bind() {
        this.bindData = ko.mapping.fromJS(tool.jsonClone(this.data))
    }


    // 显示编辑货架弹层
    showModify() {
        let modify_shelf = new Mod['modify_shelf']
        modify_shelf.create(this)
    }

    save() {
        let idx = tool.startLoading()
        setTimeout(() => {
            // 保存只保存货架名称
            this.data.shelf_title = this.bindData.shelf_title()

            this.destroy()

            layer.msg('保存成功', { icon: 1, time: 1500 });
            layer.close(idx)

            _store.set()

        }, 500);
    }

    destroy() {
        $(this.el).remove()
        gd.$$action && gd.$$action.isShowPanel(false)
    }

    // 渲染view区
    // 有数据就渲染带数据的 没有就渲染占位
    getViewHtml() {
        let obj = ko.mapping.toJS(this.bindData)
        let items = obj.items.slice(0)
        let html = ''

        // 是否为空
        let isEmpty = () => {
            return !items.length
        }

        if (!isEmpty()) {
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
                        </div>`
            })
        } else {
            let lis = ''
            for (let i = 0; i < this.showMax; i++) {
                lis += `<li></li>`
            }
            html += `
                <div class="temp-${this.type}">
                    <ul>${ lis}</ul>
                </div>`
        }

        return html
    }

}

export default ShelfTwo
