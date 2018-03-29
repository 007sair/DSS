
import Mod from '@module'

ko.components.register('cp-crumbs-tab', {

    viewModel: function (params) {

        this.createNewPage = () => {
            let create_page = new Mod['create_page']
            create_page.create()
        }

    },
    
    template: `
        <div class="dss-crumbs">
            <div class="lt fl">
                <ul class="tab">
                    <li>专题</li>
                    <li>店铺装修页</li>
                    <li>活动页</li>
                </ul>
            </div>
            <div class="rt fr">
                <a data-bind="click:createNewPage" class="btn-create" href="javascript:;">
                    <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-create"></use></svg>
                    新建页面
                </a>
            </div>
        </div>
    `
});