
import 'spectrum-colorpicker'
import '@lib/iconfont'

import './component/menu'
import './component/sidebar'
import './component/crumbs'
import './component/modules'
import './component/views'
import './component/toc'

import '@instance/event'

class Page {
    constructor() {
        this.init()
    }
    init() {
        ko.applyBindings(this, document.getElementById('page'))
    }
}

new Page()