/**
 * 拖拽事件
 */
import dragula from 'dragula'
import gd from '@instance/data'

$(function () {

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
        },
        mirrorContainer: document.getElementById('drag-modules')
    });
    drake.containers.push(el_view)

    // 触发拖拽
    drake.on('drag', function (el, source) {
        // 判断拖拽来源是不是view区
        isViewSource = source == el_view
        gd.$$preview.resetActive()
    })

    // 松开拖拽 放下
    drake.on('drop', function (el, target, source, sibling) {
        // 判定modul区模块是否被成功拖拽到view区
        if (target == el_view) { // 成功拖拽
            let type = $(el).data('type')
            // 找到对应位置，插入对应数据
            let flag = gd.$$preview.where(el)
            gd.$$preview.add(type, flag)
        }
    })

    // 拖拽结束，此事件在drop之后触发
    drake.on('dragend', function (el) {
        $(el).remove()
    })

    // 设置拖拽时的阴影
    drake.on('shadow', function (el, container, source) {
        let { isCanDrop, msg } = gd.$$preview.checkDropByEl(el)
        if (isCanDrop) {
            $(el).removeClass('error').html(`<span class="title">将模块放置在此</span>`)
        } else {
            $(el).addClass('error').html(`<span class="title">${msg}</span>`)
        }
    })


    // drag toc
    let el_toc = document.getElementById('dss-toc')
    let drakeToc = dragula([el_toc],{
        moves: function (el, source, handle, sibling) {
            return el.getAttribute('data-level') >= 3
        },
        accepts: function (el, target, source, sibling) {
            return !sibling || sibling.getAttribute('data-level') >= 3; // elements can be dropped in any of the `containers` by default
        },
        
    });

    drakeToc.on('drop', function (el, target, source, sibling) {
        // 判定modul区模块是否被成功拖拽到view区
        if (target == el_toc) { // 成功拖拽
            let cur_id = el.getAttribute('data-id')
            let next_id = sibling ? sibling.getAttribute('data-id') : null

            let cur_index = find(cur_id),
                next_index = find(next_id)

            let data = gd.$$preview.views()[cur_index]

            gd.$$preview.views.remove(data)

            function find(id) {
                if (!id) {
                    return gd.$$preview.views().length
                }
                return gd.$$preview.views().findIndex(view => {
                    return view.vid() == id
                })
            }

            gd.$$preview.views.splice(next_index, 0, data)

            // 拖拽成功后删除对应的action 防止action位置错乱
            gd.$$action.destroy()

            // 移除拖拽元素，元素实际与数据绑定好
            // 只需操作数据
            $(el).remove()
        }
    })

})