
import 'spectrum-colorpicker'
import '@lib/iconfont'
import './instance/event'

import './component/menu'
import './component/sidebar'
import './component/crumbs'
import './component/modules'

class Page {

    constructor() {
        this.init()
    }

    init() {
        ko.applyBindings(this, document.getElementById('page'))
    }

}

new Page