
import gd from '@instance/data'

ko.components.register('cp-toc', {

    viewModel: function (params) {
        
        this.lists = gd.$$preview.views

        this.isShowToc = ko.observable(false)

        this.createMap = (el) => {
            if (!this.lists().length) {
                layer.msg('请添加模块', {time: 1000})
                return false
            }

            let oRect = el.getBoundingClientRect()

            let tocList = document.querySelector('.dss-toclist');
            tocList.style.top = oRect.top + 'px'
            tocList.style.left = oRect.left - 5 + 'px'

            this.isShowToc(!this.isShowToc())
            gd.$$preview.resetActive()
        }

        gd.$$toc = this

    },
    
    template: `
        <div class="dss-toc">
            <button data-bind="click:function(){ createMap($element) },css:{active:isShowToc}">
                <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-map"></use></svg>
            </button>
        </div>
        <div class="dss-toclist" data-bind="visible:isShowToc">
            <div class="box" data-bind="foreach:lists" id="dss-toc">
                <div class="item" data-bind="text:$data.title,attr:{'data-id':$data.vid(), 'data-level':$data.level()},css:{disabled:$data.level() < 3}"></div>
            </div>
        </div>
    `
});
