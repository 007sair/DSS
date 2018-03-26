
class Pagination {

    constructor(config, callback) {
        this.handle = callback
        this.config = Object.assign({}, config);

        this.el = 'ko-pagination'

        this.pagerCount = this.config.pager || 5;    // 如果分页的页面太多，截取部分页面进行显示，默认设置显示6个页面
        this.pageSize = this.config.size || 10;     // 每页显示的记录数
        this.currentPage = ko.observable(1);    // 当前页面Index
        this.jumpPage = ko.observable(1);       // 需要跳转的页面的Index
        this.pageCount = ko.observable(0);      // 总页数
        this.showStartPagerDot = ko.observable(false);  // 页面开始部分是否显示点号
        this.showEndPagerDot = ko.observable(false);    // 页面结束部分是否显示点号
        this.pages = ko.observable([]);     // 需要显示的页面数量
        this.total = ko.observable(0);       // 记录总数

        this.init()
    }

    getHtml() {
        return `
            <div class="dss-pagination">
                <ul>
                    <li data-bind="click:goToPrev" class="prev"></li>
                    <!--ko if:showStartPagerDot-->
                    <li class="dot">...</li>
                    <!--/ko-->
                    <!--ko foreach:pages-->
                    <li data-bind="text:$data, 
                        css:{'active':$data == $parent.currentPage()}, 
                        click:$parent.goToPage.bind($parent, $data)"
                    ></li>
                    <!--/ko-->
                    <!--ko if:showEndPagerDot-->
                    <li class="dot">...</li>
                    <!--/ko-->
                    <li data-bind="click:goToNext" class="next"></li>
                </ul>
                <span class="info" data-bind="text:formatedInfo"></span>
                <span class="jump">第<input data-bind="value:jumpPage" type="text">页<button data-bind="click:jump">跳转</button></span>
            </div>
        `
    }

    caculatePages() {
        let result = [], 
            pagerCount = this.pagerCount, 
            start = 1, 
            end = pagerCount;
        if (this.currentPage() >= pagerCount) {
            start = this.currentPage() - Math.floor(pagerCount / 2);
            this.showStartPagerDot(true);
        } else {
            this.showStartPagerDot(false);
        };
        end = start + pagerCount - 1;
        if (end >= this.pageCount()) {
            end = this.pageCount();
            this.showEndPagerDot(false);
        } else {
            this.showEndPagerDot(true);
        };

        for (var i = start; i <= end; i++) {
            result.push(i);
        };
        this.pages(result);
    }

    init() {
        let oEl = document.getElementById(this.el)
        if (!oEl) return false

        // binding data
        this.data = ko.mapping.fromJS(this.data);

        oEl.innerHTML = this.getHtml()

        // computed
        this.formatedInfo = ko.computed(() => {
            return `共${ this.pageCount() }页 每页显示${ this.pageSize }条 共${ this.total() }条数据`
        })

        ko.applyBindings(this, oEl)
    }

    // 点击跳转
    goToPage(page) {
        if (typeof this.handle === 'function') {
            this.handle((data) => {
                this.pageCount(Math.ceil(data.count / this.pageSize));
                this.currentPage(page);
                this.jumpPage(null);
                this.caculatePages();
                this.total(data.count);
            })
        }
        
    }

    //回到首页
    goToFirst () {
        this.goToPage(1);
    }

    //跳转到最后一页
    goToLast () {
        this.goToPage(this.pageCount());
    }

    //上一页
    goToPrev () {
        var cur = +this.currentPage();
        if (cur > 1) {
            this.goToPage(cur - 1);
        };
    }

    //下一页
    goToNext () {
        var cur = +this.currentPage();
        if (cur < this.pageCount()) {
            this.goToPage(cur + 1);
        };
    }

    //跳转
    jump () {
        var page = this.jumpPage();
        if (page > 0 && page <= this.pageCount()) {
            this.goToPage(page);
        }
    }
}

export default Pagination
