
import tool from '@instance/tool'
import Mod from '@module'
import Action from './action'
import _store from '@instance/store'

class Preview {

    constructor() {
        this.el = document.getElementById('drag-view')
        this.init()
    }

    init() {
        if (!this.el) return false
        this.el.innerHTML = this.getHtml()

        // 从 store 获取数据
        // 增加ko绑定需要用到的属性
        let arr = [], sObj = _store.get();
        if (sObj) {
            let views = JSON.parse(sObj)
            arr = views.map((view) => {
                let mod = new Mod[view.type];
                mod.data = view.data
                mod.bind() // set bindData
                return this.mergedata2ko(mod, view)
            })
        }

        this.views = ko.observableArray(arr)

        ko.applyBindings(this, this.el)

        // 监听数组变化，但不监听数组内对象值的变化
        this.views.subscribe(item => {
            _store.set()
            this.updataNav()
        })

        this.updataNav()
    }

    getHtml() {
        return `
        <!-- ko foreach:views -->
        <div class="view" data-bind="html:$data.html,attr:{id:$data.vid,'data-level':$data.level},css:{'active':$data.isActive,['view-'+$data.type]:true},click:function(){$parent.active.call($parent,$data,event,$element)}">
        </div>
        <!-- /ko -->`
    }

    // 选中
    active(item, event, el) {
        let context = ko.contextFor(event.target); //获取绑定元素的上下文;event.target绑定View Model的DOM元素
        let index = context.$index()

        // 当前选中的元素
        this.$active = $(el)

        // 取消非目标数据的选中状态
        this.views().forEach((view, idx) => {
            if (index !== idx) {
                view.oAction && view.oAction.destroy()
                view.isActive(false)
            }
        })
        item.isActive(!item.isActive())

        if (item.isActive()) {
            item.oAction = new Action(item)
            // 将当前模块挂载到子模块，子模块内部会调用当前模块
            item.oAction.parent = this
            // 创建子模块：悬浮操作区
            item.oAction.create()
        } else {
            item.oAction && item.oAction.destroy()
        }
    }

    // 拖拽成功后调用
    // 在对应位置添加数据，更新dom
    add(el, type) {
        let $prev = $(el).prev(), $next = $(el).next()
        let mod = new Mod[type]

        // 根据mod，创建一份自定义属性的模块数据
        let data = this.mergedata2ko(mod, {})

        // 根据拖拽元素的位置在数组的对应位置插入模块数据
        if ($prev.length) { // 中间或底部
            let id = $prev.attr('id');
            let idx = this.views().findIndex((view) => {
                return view.vid() == id
            })
            this.views.splice(idx + 1, 0, data)
        } else { // 顶部
            this.views.unshift(data)
        }

        // console.log(this.views());
    }

    // 删除某个元素
    del(one) {
        this.views.remove(one)
    }

    // 拖拽新模块时重置view区选中状态
    resetActive() {
        this.views().forEach(view => {
            if (view.oAction) {
                view.oAction.destroy()
                view.isActive(false)
            }
        })
    }

    updataNav() {
        let nav_mod = this.views().filter((view) => view.type == 'nav')[0]
        if (!nav_mod) return false
        nav_mod.data.nav = this.views().filter((data) => data.type == 'hr')
        nav_mod.html(nav_mod.getViewHtml())
    }

    // 设置层级关系，限制上移下移
    setLevel(type) {
        let level = 3
        if (type == 'topbanner') level = 1
        if (type == 'nav') level = 2
        return level
    }

    /**
     * 将数据转换成ko绑定时需要使用的数据格式
     * @param {object} mod    根据类型获取到的模块数据
     * @param {object} data   原始数据，创建就传{}，刷新就传获取到的数据   
     */
    mergedata2ko(mod, data) {
        let base = {
            vid: data.vid || `view-${ tool.guid() }`,
            isActive: false,
            html: ko.observable(mod.getViewHtml()),
            level: this.setLevel(mod.type)
        }
        return Object.assign(mod, data, ko.mapping.fromJS(base))
    }

}

export default Preview