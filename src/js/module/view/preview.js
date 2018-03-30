
import tool from '@instance/tool'
import Mod from '@module'
import Action from './action'
import _store from '@instance/store'
import gd from '@instance/data'

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
        // 取消非目标数据的选中状态
        this.views().forEach((view, idx) => {
            if (item.vid() !== view.vid()) {
                gd.$$action && gd.$$action.destroy()
                view.isActive(false)
            }
        })
        item.isActive(!item.isActive())

        if (item.isActive()) {
            gd.$$activeMod = item
            gd.$$activeMod.$active = $(el)
            gd.$$action = new Action()
            gd.$$action.create()
        } else {
            gd.$$action && gd.$$action.destroy()
        }
        
    }

    // 拖拽成功后调用
    // 在对应位置添加数据，更新dom
    add(type, index) {
        let mod = new Mod[type]

        // 根据mod，创建一份自定义属性的模块数据
        let data = this.mergedata2ko(mod, {})

        let oDropInfo = this.checkDropByData(data, index)

        if (oDropInfo.isCanDrop) {
            this.views.splice(index, 0, data)
        } else {
            layer.msg(`[${data.title}] ${oDropInfo.msg}`, { time: 1500 })
        }

    }

    // 获取元素被插入的位置
    where(el) {
        let index = -1,
            $prev = $(el).prev(), 
            $next = $(el).next()

        // 根据拖拽元素的位置在数组的对应位置插入模块数据
        if ($prev.length) { // 中间或底部
            let id = $prev.attr('id');
            let idx = this.views().findIndex((view) => {
                return view.vid() == id
            })
            index = idx + 1;
        } else { // 顶部
            index = 0
        }

        return index
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

    /**
     * 检查模块是否可以被成功放入view区
     * @param {object} data     传入当前要添加的数据
     * @param {number} index    传入要判断的位置
     * @return 
     *   isCanDrop  默认true。false为不可放下
     *   msg        不可放下时的提示信息
     */
    checkDropByData(data, index) {
        let arr_views = this.views()
        let prevData = arr_views[index-1]
        let nextData = arr_views[index]
        let prev_level = prevData ? prevData.level() : undefined
        let next_level = nextData ? nextData.level() : undefined

        let result = this.checkLevel(data.type, prev_level, next_level)

        return {
            isCanDrop: result.isCanDrop,
            msg: result.msg
        }
    }


    checkDropByEl(el) {
        let type = $(el).data('type')
        // 坑：获取level属性，不能用data() 貌似会缓存
        let prev_level = $(el).prev().attr('data-level')
        let next_level = $(el).next().attr('data-level')

        let result = this.checkLevel(type, prev_level, next_level)

        return {
            isCanDrop: result.isCanDrop,
            msg: result.msg
        }

    }

    // 根据类型，获取当前元素或数据的放置信息
    checkLevel(type, prev_level, next_level) {
        let self = this
        let isCanDrop = true
        let msg = ''
        
        prev_level = prev_level || 0
        next_level = next_level || 3

        switch (type) {
            case 'topbanner':
                if (has('topbanner')) {
                    isCanDrop = false
                    msg = '模块已存在'
                } else {
                    if (prev_level) { // 不在顶部
                        isCanDrop = false
                        msg = '模块需在顶部'
                    }
                }
                break;
            case 'nav':
                if (has('nav')) {
                    isCanDrop = false
                    msg = '模块已存在'
                } else {
                    if (has('topbanner')) {
                        if (prev_level == 1 && next_level == 3) {
                            isCanDrop = true
                        } else {
                            isCanDrop = false
                            msg = '模块需在专题头图下方'
                        }

                    } else {
                        if (prev_level) { // 不在顶部
                            isCanDrop = false
                            msg = '模块需在顶部'
                        }
                    }
                }
                break;
    
            default:
                if (next_level && next_level < 3) {
                    isCanDrop = false
                    msg = next_level < 2 ? '模块需在专题头图下方' : '模块需在导航下方'
                }
                break;
        }
    
        function has(type) {
            let flag = false
            self.views().forEach(view => {
                if (view.type == type) {
                    flag = true
                }
            })
            return flag
        }

        // 第一个模块
        if (!prev_level && !next_level) {
            isCanDrop = true
        }


        return { isCanDrop, msg }
    }
    

}

export default Preview