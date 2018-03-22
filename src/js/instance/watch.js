
import global_data from '_instance/data'
import dom, { el_module, el_view } from "_instance/dom";
import _store from '_instance/store'
import tool from '_instance/tool'

// 观察global_data属性的变化，set时触发case
// 任何赋值都会触发set，如：global_data.isDomUpdate = +new Date()
tool.observe(global_data, function (data, key, val, newVal) {
    // console.log(data, key, val, newVal);
    // 判断被修改的属性
    switch (key) {

        // 监测view区的dom是否更新
        case 'isDomUpdate':
            dom.eachViews()
            dom.renderViewNav()

            _store.set() // !!! set操作必须在dom操作后执行
            console.log('updated view dom');
            break;

        // 根据属性判断view区是否添加class
        case 'isViewEmpty': 
            if (!newVal) { // 有数据
                $(el_view).addClass('view-box-draged')
            } else {
                $(el_view).removeClass('view-box-draged')
            }
            break;

        // 是否显示设置面板区
        case 'isSettingPanelShow':
            if (!dom.$settingBtn) return false // 设置按钮没有被点击时，不触发如下代码
            if (newVal) { // 没显示
                dom.$settingBtn.addClass('active')
                dom.createSettingPanel()
            } else {
                dom.$settingBtn.removeClass('active')
                dom.removeSettingPanel()
                dom.$settingBtn = null
            }
            break;

        default:
            break;
    }

})


function eachViews() {
    
}
