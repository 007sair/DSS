
import tool from '@instance/tool'
import Mod from '@module'
import gd from '@instance/data'

class Action {

    constructor() {
        // 当前悬浮操作区容器
        this.el = null
        // 当前父对象，为创建的模块 preview.js
        // 子对象，一般为对应的设置面板
        this.mod = gd.$$activeMod
        // 是否显示设置面板
        this.isShowPanel = ko.observable(false)
        // 悬浮操作区的按钮配置
        this.buttons = this.mod.actions || ['setting','up', 'dn', 'delete']
    }

    getHtml() {
        return `
            <ul data-bind="foreach: buttons">
                <li data-bind="css:{'active':$parent.hightlight($data)},click:function(){ $parent.fire.call($parent,$data) },html:$parent.getIcon($data)">
                </li>
            </ul>
        `
    }

    getIcon(name) {
        return `
            <svg class="icon-svg" aria-hidden="true">
                <use xlink:href="#icon-${name}"></use>
            </svg>
        `
    }

    // 创建设置面板
    create() {
        this.destroy()
        this.el = document.createElement('div')
        this.el.className = 'dss-action'
        this.el.innerHTML = this.getHtml()
        this.el.style.left = tool.getOffset(gd.$$activeMod.$active).left + 'px'
        this.el.style.top = tool.getOffset(gd.$$activeMod.$active).top + 'px'
        document.body.appendChild(this.el)

        ko.applyBindings(this, this.el)
    }

    // 销毁action的同时 销毁设置面板
    destroy() {
        $(this.el).remove()
        this.mod && this.mod.destroy()
    }

    // 高亮的条件，可自行设置
    hightlight(action) {
        if (action == 'setting') { // 当为设置按钮，且出现面板时，高亮
            return this.isShowPanel()
        }
    }

    fire(action) {
        let arr = gd.$$preview.views()
        let idx = arr.findIndex(view => {
            return view.vid() == this.mod.vid()
        })

        switch (action) {
            case 'setting':
                this.togglePanel()
                break;
            case 'delete':
                this.delView()
                break;
            case 'up':
                if (idx == 0 || this.mod.level() > arr[idx - 1].level()) {
                    layer.msg('已到顶部，不可上移', {time: 1000 });
                } else {
                    tool.moveToUp(gd.$$preview.views, idx)
                    this.create()
                }
                break;
            case 'dn':
                tool.moveToDown(gd.$$preview.views, idx)
                this.create()
                break;
            default:
                break;
        }
    }

    // 显示/隐藏 设置面板区
    togglePanel() {
        if (this.isShowPanel()) {
            this.mod.destroy()
            this.isShowPanel(false)
        } else {
            let offset = tool.getOffset($(this.el))
            this.mod.create(offset)
            this.isShowPanel(true)
        }
    }

    delView() {
        swal({
            title: `${this.mod.title}`,
            text: "确定要删除当前模块吗？",
            icon: "warning",
            dangerMode: true,
            buttons: ['再想想', '删除']
        }).then(willDelete => {
            if (willDelete) {
                gd.$$preview.del(this.mod)
                this.destroy()
                swal("已删除!", {
                    button: false,
                    icon: 'success',
                    timer: 1000
                });
            }
        });
    }

}

export default Action