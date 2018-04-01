import gd from '@instance/data'
import Mod from '@module'
import _store from '@instance/store'

ko.components.register('cp-crumbs', {

    viewModel: function (params) {
        this.openGlobalSetting = () => {
            let global_set = new Mod['global_set']
            global_set.create()
        }

        this.save = () => {
            let result = _store.format(gd.$$preview.views)
            console.log(result);
        }
    },
    
    template: `
        <div class="dss-crumbs">
            <div class="lt fl">
                <span class="c-gray-l">位置：</span>
                <div class="path">
                    <span>页面首页</span><span class="cur">306大促奶粉5折</span>
                </div>
                <button data-bind="click:openGlobalSetting" class="btn-globalsetting">
                    <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-setting"></use></svg>
                    全局设置
                </button>
            </div>
            <div class="rt fr">
                <button>预览</button>
                <button data-bind="click:save">保存</button>
                <button>提交</button>
            </div>
        </div>
    `
});