import tool from '@instance/tool'

class CreatePage {

    constructor() {

        // 当前模块的容器
        this.el = null

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
    getHtml() {
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
        this.el = document.createElement('div')
        this.el.className = 'dss-createpage'
        this.el.innerHTML = this.getHtml()
        document.body.appendChild(this.el)
        
        ko.applyBindings(this, this.el)
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
        document.body.removeChild(this.el)
    }

}

export default CreatePage