import global_data from '_instance/data'
import tool from '_instance/tool'

class CreatePage {

    constructor() {

        // 当前模块的容器
        this.$container = null

        this.title = '新建页面'

        // 当前模块存放的数据
        this.data = ko.mapping.fromJS({
            selected_type: [],
            page_type: [
                {
                    text: '类型1',
                    value: 1
                },
                {
                    text: '类型2',
                    value: 2
                },
                {
                    text: '类型3',
                    value: 3
                }
            ],
            page_name: ''
        })
        
    }

    // 当前模块的所有html
    html() {
        return `
            <div class="dss-mask"></div>
            <div class="dss-dialog">
                <div class="tit tit-center">
                    ${this.title}
                    <i class="icon-close" data-bind="click: destroy"></i>
                </div>
                <div class="content">
                    <div class="dss-form-item">
                        <label class="form-label form-label-4">页面类型</label>
                        <div class="form-box">
                            <select data-bind="optionsValue: 'value', optionsText: 'text',options: data.page_type,selectedOptions:data.selected_type"></select>
                        </div>
                    </div>
                    <div class="dss-form-item">
                        <label class="form-label form-label-4 required">页面名称</label>
                        <div class="form-box">
                            <input data-bind="value:data.page_name, valueUpdate:'afterkeydown'" type="text" />
                        </div>
                    </div>
                </div>
                <div class="btns">
                    <button type="button" data-bind="click:save, disable:!data.page_name()" class="btn btn-primary">保存</button>
                </div>
            </div>
        `
    }

    // 创建模块元素，插入dom中
    create() {
        let self = this;
        // 渲染dom
        this.$container = $(`
            <div class="dss-createpage">${this.html()}</div>
        `).appendTo($(document.body))

        // 双向绑定
        ko.applyBindings(this, this.$container[0])

        return this.$container
    }

    save() {
        let idx = tool.startLoading('保存中...')
        setTimeout(() => {
            // 此数据为最终保存后的数据
            console.log(ko.mapping.toJS(this.data));
            layer.close(idx)
            this.destroy()
        }, 500);
    }

    destroy() {
        if (this.$container) {
            this.$container.remove()
        }
    }

}

export default CreatePage