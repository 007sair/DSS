
import store from 'store'
import global_data from '_instance/data'
import dom, { el_view } from "_instance/dom"

const STORE_VIEW = '_drag_view_'

// 本地存储
const _store = {

    // 将数据存入本地前，先清除掉操作时的一些状态，如：选中
    // 避免直接刷新页面时出现选中状态的问题
    clear() {
        let str = el_view.innerHTML
        let reg = new RegExp(/class="view(.*)active"/, "gmi");
        global_data.store.html = str.replace(reg, 'class="view$1"');
    },

    // 存储
    set() {
        this.clear()
        store.set(STORE_VIEW, JSON.stringify(global_data.store))
    },

    // 获取
    get() {
        return store.get(STORE_VIEW)
    }
}

export default _store