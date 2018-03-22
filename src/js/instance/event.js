/**
 * 事件，包含点击与拖拽
 */

import dragula from 'dragula'
import swal from 'sweetalert'

import global_data from '_instance/data'
import tool from '_instance/tool'
import _store from '_instance/store'
import dom, { el_module, el_view } from '_instance/dom';

// 如果本地存储有数据，就渲染
let store_str = _store.get()

try {
    if (store_str) {
        let obj = JSON.parse(store_str)
        if (obj.html) {
            // console.log('store.obj:', JSON.stringify(obj.data));
            console.log('store.obj:', obj);
            global_data.store = obj
            el_view.innerHTML = obj.html
            global_data.isViewEmpty = false
        }
    }
    // 渲染左侧可拖拽模块
    dom.renderModules()
} catch (error) {
    console.log(error);
}

let isViewSource = false; // 设置拖拽来源，默认不是view区

// 初始化拖拽
let drake = dragula([].slice.apply(document.querySelectorAll('.drag-module')), {
    copy: true,
    accepts: function (el, target) {
        return target === el_view
    },
    moves: function (el, source, handle, sibling) {
        return source !== el_view // 让右侧view区禁止拖拽
    }
});
drake.containers.push(el_view)

// 触发拖拽
drake.on('drag', function (el, source) {
    // 判断拖拽来源是不是view区
    isViewSource = source == el_view

    // 触发拖拽时移除view区的选中状态
    dom.removeActive()
})

// 松开拖拽 放下
drake.on('drop', function (el, target, source, sibling) {
    // 判定modul区模块是否被成功拖拽到view区
    if (target == el_view) { // 成功拖拽
        global_data.isViewEmpty = false
        global_data.isDragSuccess = true
    } else {
        global_data.isDragSuccess = false
    }
})

// 拖拽结束，此事件在drop之后触发
drake.on('dragend', function (el) {
    let id = tool.guid()
    let type = $(el).data('type')
    let oModule = dom.getModule(type)

    // 存在这个模块
    if (oModule) {
        // 成功拖拽到view区
        if (global_data.isDragSuccess) {

            if (!checkDrop(el).isCanDrop) {
                $(el).remove()
                return false
            }

            // 非view区的拖拽才生成id
            // 防止view区以后可以相互拖拽重复生成id的bug
            if (!isViewSource) {
                el.id = `view-${id}`
            }

            // 给拖放成功的元素添加样式与html
            $(el).addClass(`view view-${type}`).html(oModule.getTempHtml())

            if (oModule.data.__ko_mapping__) {
                oModule.data = ko.mapping.toJS(oModule.data)
                delete oModule.data.__ko_mapping__
            }

            console.log(oModule.data);

            // 构建全局数据
            global_data.store.data[el.id] = Object.assign({
                type: type
            }, oModule.data)

            // 先执行所有dom，再观察dom更新，做其他操作
            global_data.isDomUpdate = true

            $(`[id="${el.id}"]`).trigger('click')
        }
    } else {
        layer.msg('没有找到模块', { icon: 5, time: 1000})
        $(el).remove()
    }

})

// 设置拖拽时的阴影
drake.on('shadow', function (el, container, source) {
    let { isCanDrop, msg } = checkDrop(el)
    if (isCanDrop) {
        $(el).removeClass('error').html(`<span class="title">将模块放置在此</span>`)
    } else {
        $(el).addClass('error').html(`<span class="title">${msg}</span>`)
    }
})

// 选择模块，触发选中
$(el_view).on('click', '.view', function (e) {
    dom.$activeView = $(this)
    if (dom.$activeView.hasClass('active')) {
        dom.removeActive()
    } else {
        dom.addActive()
    }
})

// 悬浮操作区 设置
$(document.body).on('click', '.js-action-setting', function () {
    dom.$settingBtn = $(this)
    global_data.isSettingPanelShow = !global_data.isSettingPanelShow
})

// 悬浮操作区 上移
$(document.body).on('click', '.js-action-up', function () {
    dom.$activeView.moveTo('up')
    global_data.isDomUpdate = true
    dom.addActive()
})

// 悬浮操作区 下移
$(document.body).on('click', '.js-action-dn', function () {
    dom.$activeView.moveTo('dn')
    global_data.isDomUpdate = true
    dom.addActive()
})

// 悬浮操作区 删除
$(document.body).on('click', '.js-action-delete', function () {
    let id = dom.$activeView.attr('id');
    let type = dom.$activeView.data('type')

    swal({
        text: "确定要删除当前模块吗？",
        icon: "warning",
        dangerMode: true,
        buttons: ['再想想', '删除']
    })
    .then(willDelete => {
        if (willDelete) {
            dom.$activeView.remove()
            delete global_data.store.data[id]
            global_data.isDomUpdate = true
            dom.removeActive()

            swal("已删除!", {
                button: false,
                icon: 'success',
                timer: 1000
            });

            if (!el_view.innerHTML) {
                global_data.isViewEmpty = true
            }
        }
    });

})

// 显示隐藏左侧模块区的分类
$(el_module).on('click', 'h2', function () {
    $(this).toggleClass('collapse').next('.drag-module').toggle(200)
    return false
})

/**
 * 检查模块是否可以被成功放入view区
 * @param {node} el 传入需要检查的元素 原生对象
 * @return 
 *   isCanDrop  默认true。false为不可放下
 *   msg        不可放下时的提示信息
 */
function checkDrop(el) {
    let type = $(el).data('type')

    // 坑：获取level属性，不能用data() 貌似会缓存
    let prev_level = $(el).prev().attr('data-level')
    let next_level = $(el).next().attr('data-level')

    let isCanDrop = true
    let msg = '模块位置错误'

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
                    if (prev_level != 1 || next_level != 3) {
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
            if (next_level < 3) {
                isCanDrop = false
                msg = next_level < 2 ? '模块需在专题头图下方' : '模块需在导航下方'
            }
            break;
    }

    function has(type) {
        let data = global_data.store.data
        for(let key in data) {
            if (data[key].type == type) {
                return true
                break
            }
        }
        return false
    }

    // 第一个模块 永远可以插入
    if (!prev_level && !next_level) {
        isCanDrop = true
    }

    return { isCanDrop, msg }
}

// 打开全局设置弹层
$(document.body).on('click', '.js-globalset', function () {
    let global_set = dom.getModule('global_set')
    global_set.create()
})

$(document.body).on('click', '#js-save-page', function () {
    dom.eachViews()
    console.log(global_data.wholeData.data);
})

$(document.body).on('click', '#js-createpage', function () {
    let create_page = dom.getModule('create_page')
    create_page.create()
})