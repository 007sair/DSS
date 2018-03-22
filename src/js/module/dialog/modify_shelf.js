/**
 * 编辑货架商品
 */

/**
 * 全局设置
 */

import global_data from '_instance/data'
import tool from '_instance/tool'

class ModifyShelf {

    constructor() {

        // 当前模块的容器
        this.$container = null

        this.title = '编辑货架商品'

        // 当前模块存放的数据
        this.data = {
            selected: 'sku',
            items: []
        }

        // 所有添加的商品数据，临时存储
        // 数据都会在点确定后被保存到 this.data.items
        this.tmp_items = {}

        // 每条商品的序列号
        this.item_index = 0
    }

    // 当前模块的所有html
    html() {
        return `
            <div class="dss-mask"></div>
            <div class="layer-edit">
                <div class="title">
                    ${this.title}
                    <a id="js-save" href="javascript:;">确定</a>
                    <a class="cancel js-close" href="javascript:;">取消</a>
                </div>
                <div class="layer-filter">
                    <label for="">类型</label>
                    <div class="input-wrap">
                        <div class="type-select js-dropdown">
                            <span class="selected">SKU</span>
                            <ul class="drop">
                                <li data-type="sku">SKU</li>
                                <li data-type="list">特卖ID</li>
                                <li data-type="key">关键词</li>
                            </ul>
                        </div>
                        <input class="js-ipt-text" placeholder="请输入SKU" type="text">
                    </div>
                    <button class="js-add">添加</button>
                    <button class="btn-batchadd js-batch-add">
                        批量添加
                        <input type="file" name="files[]" multiple>
                    </button>
                    <a href="javascript:;">下载导入表格</a>
                </div>
                <div class="layer-tabel">
                    <ul class="layer-title">
                        <li>序号</li>
                        <li>SKU/特卖ID</li>
                        <li>商品标题</li>
                        <li>商品价格</li>
                        <li>商品图片</li>
                        <li>库存</li>
                        <li>操作</li>
                    </ul>
                    <div class="layer-content js-listbox status-isEmpty"></div>
                </div>
            </div>
        `
    }

    // 创建模块元素，插入dom中
    // 创建一个双向数据绑定 jquery.my.js
    // 从外部传入 父级 对象
    create(shelf) {
        let self = this;

        // 父级模块 设置面板区
        this.shelf = shelf

        this.$container = $(`<div class="dss-modify-shelf"></div>`)
            .html(self.html())
            .appendTo($(document.body))

        this.event()
    }

    destroy() {
        this.$container.remove()
    }

    // 绑定事件
    event() {
        let self = this

        // 暂存的jq对象
        let $selected = null;
        let $input = this.$container.find('.js-ipt-text');
        let $dropdown = this.$container.find('.js-dropdown');
        let $listbox = this.$container.find('.js-listbox')


        // 父模块中有数据，就渲染出来
        let newData = ko.mapping.toJS(self.shelf.data)

        let htmls = ''
        if (newData.items.length) {
            newData.items.forEach(obj => {
                htmls += self.getItemHtml(obj)
                self.tmp_items[obj.id] = obj
                listenListbox()
            })
        } 
        $listbox.html(htmls)


        // 选择类型
        $dropdown.on('click', function () {
            $selected = $(this).find('.selected')
            $(this).toggleClass('type-select-expand')
            $(this).find('.drop').children().each(function () {
                if ($(this).text() === $selected.text()) {
                    $(this).addClass('cur').siblings().removeClass('cur')
                }
            })
        }).find('.drop').on('click', '> li', function () {
            let type = $(this).data('type')
            let placeholder = '请输入sku'
            $selected.text($(this).text())
            self.data.selected = $(this).data('type')
            switch (type) {
                case 'sku':
                    placeholder = '请输入sku'
                    break;
                case 'list':
                    placeholder = '请输入特卖id'
                    break;
                case 'key':
                    placeholder = '请输入关键字'
                    break;
                default:
                    break;
            }
            $('.js-ipt-text').attr('placeholder', placeholder)
        })

        // 关闭
        this.$container.find('.js-close').on('click', function () {
            self.destroy()
        })

        // 确定
        this.$container.find('#js-save').on('click', function () {
            let idx = tool.startLoading('保存中，请稍后..')
            // 生成 this.data.items 数据
            self.data.items = []
            $listbox.children().each(function () {
                let id = $(this).attr('id')
                self.data.items.push(self.tmp_items[id])
            })

            setTimeout(() => {
                // 更新父模块的数据
                self.shelf.data.items(self.data.items)

                // 渲染view预览区 更新本地存储
                self.shelf.renderViewHtml()
                // 将数据和dom存储在本地
                self.shelf.saveStore()
                // 销毁弹层
                self.destroy()

                layer.close(idx)
                swal("保存成功!", {
                    button: false,
                    icon: 'success',
                    timer: 1000
                });
            }, 500);
        })

        // 添加
        this.$container.on('click', '.js-add', function () {
            let $this = $(this)
            if (!$.trim($input.val())) {
                $input.addClass('ipt-error')
                return false
            }
            let idx = tool.startLoading()
            setTimeout(() => {
                renderItem({
                    sku: '100010',
                    title: '丽婴房新生儿保暖绑带内衣上衣',
                    sp: 85,
                    img: 'https://img06.miyabaobei.com/d1/p3/item/30/3000/3000054_topic_1.jpg@base@tag=imgScale&w=100&q=100',
                    st: 100
                })
                layer.close(idx)
                swal("已添加!", {
                    button: false,
                    icon: 'success',
                    timer: 1000
                });
                listenListbox()
            }, 500);
        })

        function listenListbox() {
            if ($.isEmptyObject(self.tmp_items)) {
                $listbox.addClass('status-isEmpty')
            } else {
                $listbox.removeClass('status-isEmpty')
            }
        }

        // 监听输入框变化
        $input.on('input propertychange', function () {
            if ($.trim($(this).val())) {
                $(this).removeClass('ipt-error')
            }
        })

        // 上移
        this.$container.on('click', '.js-action-up', function () {
            let $item = $(this).closest('.item');
            $item.moveTo('up')
            return false
        })

        // 下移
        this.$container.on('click', '.js-action-dn', function () {
            let $item = $(this).closest('.item');
            $item.moveTo('dn')
            return false
        })

        // 删除
        this.$container.on('click', '.js-action-del', function () {
            let $item = $(this).parents('.item');
            let id = $item.attr('id')
            swal({
                text: "确定要删除当前商品吗？",
                icon: "warning",
                dangerMode: true,
                buttons: ['再想想', '删除']
            })
            .then(willDelete => {
                if (willDelete) { // 删除
                    $item.remove()
                    delete self.tmp_items[id]
                    listenListbox()
                    swal("已删除!", {
                        button: false,
                        icon: 'success',
                        timer: 1000
                    });
                }
            });
        })

        // 编辑标题按钮
        this.$container.on('click', '.js-modify-title', function () {
            let $p = $(this).siblings('p')
            let $input = $(this).siblings('input')
            $(this).closest('li').toggleClass('status-edit')
            $input.val($p.text())
        })

        // 标题 编辑 输入框
        this.$container.on('blur keypress', '.status-edit .js-ipt-edit', function (e) {
            let $input = $(this)
            let id = $input.closest('ul').attr('id')
            let $p = $input.siblings('p')
            if (e.type == 'keypress') {
                if (e.keyCode == '13') {
                    save()
                }
            }
            if (e.type == 'focusout') {
                save()
            }

            function save() {
                $p.text($input.val())
                self.tmp_items[id].title = $input.val()
                $input.closest('li').toggleClass('status-edit')
            }
        })

        // 渲染商品
        function renderItem(obj) {
            obj.id = `item-${tool.guid()}`
            let item_html = self.getItemHtml(obj)
            self.$container.find('.js-listbox').append(item_html)
            self.tmp_items[obj.id] = obj
        }

    }

    // 获取每条商品的html
    getItemHtml(obj) {
        if (typeof obj !== 'object') return false
        return `
            <ul class="item" id="${obj.id}">
                <li>${ this.item_index++ }</li>
                <li>${ obj.sku }</li>
                <li class="cell-title">
                    <p>${ obj.title }</p>
                    <input placeholder="按回车键保存" class="ipt-title js-ipt-edit" type="text">
                    <a href="javascript:;" class="edit-icon js-modify-title">
                        <svg class="icon-svg" aria-hidden="true">
                            <use xlink:href="#icon-bianji1"></use>
                        </svg>
                    </a>
                </li>
                <li>${ obj.sp }</li>
                <li><img class="item-img" src="${ obj.img }" alt=""></li>
                <li>${ obj.st }</li>
                <li class="cell-actions">
                    <a class="js-action-up" href="javascript:;" title="上移">
                        <svg class="icon-svg arrow-top" aria-hidden="true">
                            <use xlink:href="#icon-arrow-top"></use>
                        </svg>
                    </a>
                    <a class="js-action-dn" href="javascript:;">
                        <svg class="icon-svg arrow-bottom" aria-hidden="true">
                            <use xlink:href="#icon-arrow-bottom"></use>
                        </svg>
                    </a>
                    <a class="js-action-del" href="javascript:;">
                        <svg class="icon-svg del-icon" aria-hidden="true">
                            <use xlink:href="#icon-shanchu"></use>
                        </svg>
                    </a>
                </li>
            </ul>
        `;
    }

}

export default ModifyShelf