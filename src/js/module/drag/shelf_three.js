import ShelfTwo from "./shelf_two";

class shelfThree extends ShelfTwo {

    constructor() {

        super()

        // 当前模块的容器
        this.$container = null

        // 模块名称，通常与此文件同名
        this.type = 'shelf_three'

        // 模块标题，出现在设置面板的title处
        this.title = '三列货架'

        this.icon = 'images/m_shelf_three.png'

        this.showMax = 3
    }
}

export default shelfThree
