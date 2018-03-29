/**
 * 事件，包含点击与拖拽
 */

import dragula from 'dragula'
import swal from 'sweetalert'

import gd from '@instance/data'
import tool from '@instance/tool'
import _store from '@instance/store'
import Mod from '@module'

import Preview from '@module/view/preview'

$(function () {

    gd.preView = new Preview()

    let isViewSource = false; // 设置拖拽来源，默认不是view区

    let el_view = document.getElementById('drag-view')

    // 初始化拖拽
    const drake = dragula([].slice.apply(document.querySelectorAll('.drag-module')), {
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
        gd.preView.resetActive()
    })

    // 松开拖拽 放下
    drake.on('drop', function (el, target, source, sibling) {
        // 判定modul区模块是否被成功拖拽到view区
        if (target == el_view) { // 成功拖拽
            let { isCanDrop, msg } = checkDrop(el)
            if (isCanDrop) {
                let type = $(el).data('type')
                gd.preView.add(el, type)
                gd.isDragSuccess = true
            } else {
                $(el).remove()
                layer.msg(`放置失败：${msg}`, { time: 1000 })
            }
        } else {
            gd.isDragSuccess = false
        }
    })

    // 拖拽结束，此事件在drop之后触发
    drake.on('dragend', function (el) {
        let id = tool.guid()
        let type = $(el).data('type')
        let oModule = new Mod[type]

        // 存在这个模块
        if (oModule) {
            // 成功拖拽到view区
            if (gd.isDragSuccess) {
                // 删除当前被放置的模块，使用ko渲染
                $(el).remove()
            }
        } else {
            layer.msg('没有找到模块', { icon: 5, time: 1000 })
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
        let flag = false
        let arr = gd.preView.views()
        arr.forEach(view => {
            if (view.type == type) {
                flag = true
            }
        })
        return flag
    }

    // 第一个模块 永远可以插入
    if (!prev_level && !next_level) {
        isCanDrop = true
    }

    return { isCanDrop, msg }
}
