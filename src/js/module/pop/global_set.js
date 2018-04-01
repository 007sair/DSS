/**
 * 全局设置
 */

import gd from '@instance/data'
import tool from '@instance/tool'

class GlobalSetting {

    constructor() {

        // 当前模块的容器
        this.el = null

        this.title = '全局设置'

        // 当前模块存放的数据
        this.data = ko.mapping.fromJS({
            shelf_name: '',
            shelf_color: '',
            share_title: '',
            share_desc: '',
            share_img: '',
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
                        <label class="form-label form-label-4 required">货架名称</label>
                        <div class="form-box">
                            <input type="text" data-bind="value:data.shelf_name, valueUpdate:'afterkeydown'" class="form-input" placeholder="填入名称">
                        </div>
                    </div>
                    <div class="dss-form-item">
                        <label class="form-label form-label-4">货架底色</label>
                        <div class="form-box">
                            <div class="color-picker">
                                <input id="_colorpicker_" data-bind="value:data.shelf_color" type="text" />
                            </div>
                        </div>
                    </div>
                    <div class="dss-form-item">
                        <label class="form-label form-label-4">分享标题</label>
                        <div class="form-box">
                            <input type="text" data-bind="value: data.share_title" class="form-input" placeholder="分享标题不超过20字">
                        </div>
                    </div>
                    <div class="dss-form-item">
                        <label class="form-label form-label-4">分享内容</label>
                        <div class="form-box">
                            <textarea name="" data-bind="value: data.share_desc" cols="30" rows="5" placeholder="分享内容不超过80字"></textarea>
                        </div>
                    </div>
                    <div class="dss-form-item">
                        <label class="form-label form-label-4">分享图片</label>
                        <div class="form-box">
                            <div class="upload-share">
                                <div class="img">
                                    <img data-bind="attr: { src: data.share_img }">
                                </div>
                                <div class="btn">
                                    <button>本地上传<input data-bind="event: { change: function() { uploadImage($element.files[0]) } }" type="file" name="files[]" multiple></button>
                                    <p>大小不能超过300K</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btns">
                    <button type="button" data-bind="click:save, disable:!data.shelf_name()" class="btn btn-primary">保存</button>
                </div>
            </div>
        `
    }

    // 创建模块元素，插入dom中
    create() {
        this.el = document.createElement('div')
        this.el.className = 'dss-globalset'
        this.el.innerHTML = this.getHtml()
        document.body.appendChild(this.el)

        // 初始化色板
        this.setColor()

        // 双向绑定
        ko.applyBindings(this, this.el)
    }

    setColor() {
        let self = this
        let $colorPicker = $(this.el).find('#_colorpicker_');
        let colorPicker_config = Object.assign({}, gd.colorPicker, {
            color: self.data.shelf_color() || '#333',
            change: function(color) {
                self.data.shelf_color(color.toHexString())
            }
        })
        $colorPicker.spectrum(colorPicker_config).show()
        let curColor = $colorPicker.spectrum("get");
        this.data.shelf_color(curColor.toHexString())
    }

    uploadImage(file) {
        tool.requestUpload(file, (res) => {
            this.data.share_img(res.url)
        })
    }

    save() {
        let idx = tool.startLoading('保存中...')
        setTimeout(() => {
            // 此数据为最终保存后的数据
            console.log(ko.mapping.toJS(this.data));
            layer.close(idx)
        }, 500);
    }

    destroy() {
        document.body.removeChild(this.el)
    }

}

export default GlobalSetting