import store from 'store'
import gd from '@instance/data'

const STORE_VIEW = '_drag_view_'

// 本地存储
const _store = {

    set() {
        console.log('fire store');
        store.set(STORE_VIEW, JSON.stringify(this.ko2obj()))
    },

    get() {
        return store.get(STORE_VIEW)
    },

    ko2obj() {
        return ko.mapping.toJS(gd.$$preview.views, {
            include: ["data", 'type'],
            ignore: ['html', 'isActive']
        })
    },
}

export default _store