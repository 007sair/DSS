
import global_data from '_instance/data'
import Module, { map } from '_module'
import tool from '_instance/tool'

let dom = {

    el_module: document.getElementById('drag-modules'), // 右侧view区
    el_view: document.getElementById('drag-view'), // 左侧module区

    $activeView: null, // view区，被选中元素
    $action: null, // 悬浮操作区
    $settingPanel: null, // 设置面板区
    $settingBtn: null, // 悬浮操作区 设置按钮
    $globalSetting: null, // 全局设置

    // 模板对象
    oModule: null,

    // 根据类型获取模块对象
    getModule(type) {
        let mod = null
        try {
            mod = new Module[type]
        } catch (error) {
            console.log(error);
        }
        return mod
    },

    // 渲染左侧模块区
    renderModules() {
        let arr_module = map;
        let html = '';
        arr_module.forEach((box) => {
            let str = '';
            box.child.forEach((mod) => {
                mod.icon = mod.icon ? mod.icon : 'images/m_banner.png';
                str += `
                    <div data-type="${mod.type}">
                        <i style="background-image:url('${mod.icon}')"></i>
                        <p>${mod.title}</p>
                    </div>`
            })
            html += `
                <h2>${box.title}</h2>
                <div class="drag-module">${str}</div>
            `
        })

        this.el_module.innerHTML = html
    },

    /**
     * 根据传入jq对象，返回一个包含偏移量的对象
     * @param {jQueryObj}  元素，jq对象
     */
    getOffset($el) {
        return {
            top: $el.offset().top,
            left: $el.offset().left + $el.width() + 12
        }
    },

    /**
     * 给 $activeView 添加 active 样式，并生成一个悬浮操作区
     * 若之前存在悬浮操作区，删除之前的悬浮区
     */
    addActive() {

        if (!this.$activeView) return false

        if (this.$action) { // dom中只允许出现一个悬浮操作区
            this.removeActive()
        }

        this.$activeView.addClass('active').siblings().removeClass('active')

        let lis = '',
            type = this.$activeView.data('type'),
            offset = this.getOffset(this.$activeView);

        // 根据type类型获取对应的模板对象
        // 模板对象内包含模板数据，设置、获取模板数据的方法等
        this.oModule = dom.getModule(type)

        if (!this.oModule) {
            layer.msg('没有找到模块', { icon: 5 })
            return false
        }

        this.oModule.actions.forEach((action) => {
            lis += `
                <li class="js-action-${action}">
                    <svg class="icon-svg" aria-hidden="true">
                        <use xlink:href="#icon-${action}"></use>
                    </svg>
                </li>
            `;
        });

        this.$action = $(`<div class="dss-action">`)
            .css({
                top: offset.top,
                left: offset.left
            })
            .html(`<ul>${lis}</ul>`)
            .appendTo($(document.body))

        return this.$action
    },

    // 删除悬浮操作区
    // 注意，设置面板区也会被删除
    removeActive() {
        if (!this.$activeView) return false
        this.$activeView.removeClass('active')
        global_data.isSettingPanelShow = false
        if (this.$action) {
            this.$action.remove()
            this.$action = null
        }
    },

    /**
     * 点击悬浮操作区"设置"按钮，创建设置面板
     * 创建的面板分 有数据 与 无数据
     */
    createSettingPanel() {
        if (!this.$activeView) return false
        let type = this.$activeView.data('type')

        if (!this.oModule) {
            layer.msg('没有找到模块', { icon: 5 })
            return false
        }

        this.$settingPanel = this.oModule.create()
    },

    // 删除
    removeSettingPanel() {
        if (!this.$settingPanel) return false
        this.$settingPanel.remove()
    },

    /**
     * 遍历view区的所有模块
     * 调用时机：view区模块更新时
     */
    eachViews() {
        // 重置数据，下面会重新生成
        global_data.wholeData.data = []

        // 重置导航数据
        global_data.store.nav.data = []

        let nav_id = ''

        // 遍历每个模块
        $(el_view).children().each(function (index, el) {

            // 根据id 找到当前模块的数据
            let cur_data = global_data.store.data[el.id]

            let type = el.getAttribute('data-type')
            let level = 3

            // 将当前数据放入 wholeData 中
            global_data.wholeData.data.push(cur_data)

            if (type == 'topbanner') {
                level = 1
            }

            if (type == 'nav') {
                level = 2
                nav_id = el.id
            }

            // 重要：重置每个level级别
            // 判断拖拽的模块是否能被放入view区，依赖于level
            el.setAttribute('data-level', level)

            // 将每个分隔栏模块的数据拼装成一个导航数据
            // 数据被存放到 global_data.store.nav 中
            if (type === 'hr') {
                global_data.store.nav.id = nav_id
                global_data.store.nav.data.push({
                    id: el.id,
                    title: cur_data.text || '分隔栏',
                })
            }

        })
    },

    // 生成导航
    renderViewNav() {
        let oNav = dom.getModule('nav')
        if (!oNav) {
            layer.msg('没有找到导航模块', { icon: 5 })
            return false
        }
        let global_data_nav = global_data.store.nav;
        oNav.update((data) => {
            data.nav = global_data_nav.data
        })
        oNav.renderViewHtml($(`[id="${global_data_nav.id}"]`))
    },

}

export let el_module = dom.el_module
export let el_view = dom.el_view

export default dom