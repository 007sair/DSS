import store from 'store'
import gd from '@instance/data'

const STORE_VIEW = '_drag_view_'

// 本地存储
const _store = {

    set() {
        let obj = this.format(gd.$$preview.views)
        store.set(STORE_VIEW, JSON.stringify(obj))
        console.log('fire store');
    },

    get() {
        return store.get(STORE_VIEW)
    },

    // 格式化需要的字段
    format(_ko) {
        return ko.mapping.toJS(_ko, {
            include: ["data", 'type'],
            ignore: ['_html', 'isActive']
        })
    },
}

export default _store