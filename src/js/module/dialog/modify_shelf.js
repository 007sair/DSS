/**
 * 编辑货架商品
 */
import tool from '_instance/tool'

/**
 * 同时绑定enter与blur事件，回车和失焦使用一个函数
 * @绑定
 *   方法1：data-bind="enterBlur:toggleTitleInput.bind($parent)"
 *   方法2：data-bind="enterBlur:function(){ $parent.toggleTitleInput(event) }"
 * @调用 
 *   toggleTitleInput(event) {
 *     console.log(this)    // this作用域为viewModel
 *     console.log(event)   // event为事件对象
 *   }
 */
ko.bindingHandlers.enterBlur = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        var callback = valueAccessor();
        $(element).on('keypress blur', function (event) {
            if (event.type == 'blur') {
                callback.call(viewModel, event);
                return false
            }
            if (event.type == 'keypress') {
                let keyCode = (event.which ? event.which : event.keyCode);
                if (keyCode === 13) {
                    $(this).blur()
                    return false;
                }
            }
            return true
        })
    }
};

class ModifyShelf {

    constructor() {

        this.$container = null

        this.title = '编辑货架商品'

        this.editing = ko.observable(false)

        this.isSelectShow = ko.observable(false)
        this.types = ko.observableArray([
            { type: 'sku', text: 'SKU' },
            { type: 'list', text: '特卖id' },
            { type: 'key', text: '关键词' }
        ])

        this.indexCount = ko.observable(0)

        // 被选中的类型对象
        this.selectedType = ko.observable(this.types()[0])

        this.value = ko.observable('')

        this.items = []

    }

    getHtml() {
        return `
            <div class="dss-mask"></div>
            <div class="layer-edit">
                <div class="title">
                    <span data-bind="text:title"></span>
                    <a data-bind="click:save" href="javascript:;">确定</a>
                    <a data-bind="click:close" class="cancel" href="javascript:;">取消</a>
                </div>
                <div class="layer-filter">
                    <label for="">类型</label>
                    <div class="input-wrap">
                        <div class="type-select" data-bind="click:toggleType">
                            <span class="selected" data-bind="text:selectedType().text"></span>
                            <ul class="drop" data-bind="foreach:types,style:{'display':isSelectShow() ? '' : 'none'}">
                                <li data-bind="text:$data.text,click:$parent.choseType.bind($parent),css:{'cur':$parent.selectedType().text == $data.text}"></li>
                            </ul>
                        </div>
                        <input data-bind="value:value,valueUpdate:'afterkeydown'" placeholder="请输入SKU" type="text">
                    </div>
                    <button data-bind="click:addItem,disable:!value()">添加</button>
                    <button class="btn-batchadd" data-bind="click:addItems">
                        批量添加
                        <input data-bind="event: { change: function() { uploadFile($element.files[0]) } }" type="file" name="files[]" multiple>
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
                    <div class="layer-content" data-bind="foreach:items,css:{'status-isEmpty':!items().length}">
                        <ul class="item">
                            <li data-bind="text:$data.index"></li>
                            <li data-bind="text:$data.sku"></li>
                            <li data-bind="css: { 'status-edit': $data.isEdit() }" class="cell-title">
                                <p data-bind="text:$data.title" data-bind="visible:$parent.editing()"></p>
                                <input data-bind="value:$data.title,valueUpdate:'change',enterBlur:$parent.toggleTitleInput.bind($parent)" placeholder="按回车键保存" class="ipt-title" type="text">
                                <a data-bind="click:function(){ $parent.toggleTitleInput.call($parent, event) }" href="javascript:;" class="edit-icon">
                                    <svg class="icon-svg" aria-hidden="true">
                                        <use xlink:href="#icon-bianji1"></use>
                                    </svg>
                                </a>
                            </li>
                            <li data-bind="text:$data.sp"></li>
                            <li><img data-bind="attr:{src:$data.img}" class="item-img" alt=""></li>
                            <li data-bind="text:$data.st"></li>
                            <li class="cell-actions">
                                <a data-bind="click:$parent.moveUp.bind($parent)" href="javascript:;" title="上移">
                                    <svg class="icon-svg arrow-top" aria-hidden="true">
                                        <use xlink:href="#icon-arrow-top"></use>
                                    </svg>
                                </a>
                                <a data-bind="click:$parent.moveDown.bind($parent)" href="javascript:;">
                                    <svg class="icon-svg arrow-bottom" aria-hidden="true">
                                        <use xlink:href="#icon-arrow-bottom"></use>
                                    </svg>
                                </a>
                                <a data-bind="click:$parent.delItem.bind($parent)" href="javascript:;">
                                    <svg class="icon-svg del-icon" aria-hidden="true">
                                        <use xlink:href="#icon-shanchu"></use>
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    }

    // 创建弹层
    create(shelf) {
        this.shelf = shelf
        this.$container = $(`<div class="dss-modify-shelf"></div>`)
            .html(this.getHtml())
            .appendTo($(document.body))

        // 创建一份原始数据的副本
        let source = ko.mapping.toJS(this.shelf.data.items).slice(0)
        // 每次打开弹层时取副本数据
        this.items = ko.mapping.fromJS(source)

        ko.applyBindings(this, this.$container[0])
    }

    // 关闭弹层
    close() {
        this.$container.remove()
    }

    // 确定按钮
    save() {
        let idx = tool.startLoading()
        setTimeout(() => {
            // 更新父模块的数据
            this.shelf.data.items(this.items()) 

            // 渲染view预览区 更新本地存储
            this.shelf.renderViewHtml()
            // 将数据和dom存储在本地
            this.shelf.saveStore()

            this.close()
            layer.close(idx)
        }, 500);
    }

    // 显示/隐藏 类型下拉框
    toggleType() {
        this.isSelectShow(!this.isSelectShow())
    }

    // 选择 下拉类型
    choseType(item) {
        this.selectedType(item)
    }

    // 添加商品
    addItem() {
        let idx = tool.startLoading('添加中，请稍后')
        setTimeout(() => {

            this.items.push(ko.mapping.fromJS({
                index: this.indexCount(),
                sku: '100010',
                title: '丽婴房新生儿保暖绑带内衣上衣',
                sp: 85,
                img: 'https://img06.miyabaobei.com/d1/p3/item/30/3000/3000054_topic_1.jpg@base@tag=imgScale&w=100&q=100',
                st: 100,
                isEdit: false
            }))
            this.indexCount(this.indexCount() + 1)

            layer.close(idx)
        }, 0);
    }

    // 批量添加商品
    addItems() {
        console.log('批量添加');
        return true 
    }

    // 批量添加触发上传控件
    uploadFile(file) {
        console.log(file);
    }

    // 删除商品
    delItem(item, event) {
        let context = ko.contextFor(event.target); //获取绑定元素的上下文;event.target绑定View Model的DOM元素
        let index = context.$index();

        swal({
            text: "确定要删除当前商品吗？",
            icon: "warning",
            dangerMode: true,
            buttons: ['再想想', '删除']
        })
        .then(willDelete => {
            if (willDelete) {
                this.items.splice(index, 1)
                swal("已删除!", {
                    button: false,
                    icon: 'success',
                    timer: 1000
                });
            }
        });
    }

    // 上移
    moveUp(item, event) {
        let context = ko.contextFor(event.target); //获取绑定元素的上下文;event.target绑定View Model的DOM元素
        let index = context.$index();
        if (index !== 0) {
            this.items(tool.swapItems(this.items(), index, index - 1))
        } else {
            layer.msg('已到顶部', {time: 1000})
        }
    }

    // 下移
    moveDown(item, event) {
        let context = ko.contextFor(event.target); //获取绑定元素的上下文;event.target绑定View Model的DOM元素
        let index = context.$index();
        if (index !== this.items().length - 1) {
            this.items(tool.swapItems(this.items(), index, index + 1))
        } else {
            layer.msg('已到底部', {time: 1000})``
        }
    }
    
    // 编辑标题
    toggleTitleInput(event) {
        let context = ko.contextFor(event.target); //获取绑定元素的上下文;event.target绑定View Model的DOM元素
        let index = context.$index();

        this.items().forEach((item, idx) => {
            if (idx != index) {
                item.isEdit(false)
            }
        })
        this.items()[index].isEdit( !this.items()[index].isEdit() )
    }

}

export default ModifyShelf