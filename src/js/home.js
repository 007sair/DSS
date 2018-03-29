import '@lib/iconfont'
import tool from '@instance/tool'

import '@component/menu'
import '@component/sidebar'
import '@component/crumbs_tab'

import Table from '@module/view/table'
import Pagination from '@component/pagination'

class Page {

    constructor() {
        this.init()
    }

    init() {

        ko.applyBindings(this, document.getElementById('page'))

        ko.applyBindings(new Table, document.getElementById('js-home-list'))

        // 分页器
        let pagination = new Pagination({}, (cb) => {
            let idx = tool.startLoading()
            setTimeout(() => {
                // 这个里面传入 页面总数，每页条数
                cb && cb.call(this, {
                    count: 121
                })
                layer.close(idx)
            }, 500);
        })
        pagination.goToPage(1)
    }
}

new Page
