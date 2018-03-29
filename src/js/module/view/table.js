
class Table {

    constructor() {

        this.data = ko.mapping.fromJS({
            isStateShow: false,
            isStateSelected: '',
            states : ['已发布', '审核通过', '待审核', '被驳回', '已下线'],
        })

        this.list = ko.observableArray([
            {
                sku: 10010,
                title: '306大促奶粉5折306大促奶粉5折306大促奶粉5折306大促奶粉5折',
                time: '2018-2-28  11:11:22',
                status: '已发布',
                rr: '------------'
            },
            {
                sku: 20010,
                title: '306大促奶粉5折306大促奶粉5折306大促奶粉5折306大促奶粉5折',
                time: '2018-2-28  11:11:22',
                status: '已发布',
                rr: '------------'
            },
            {
                sku: 100102,
                title: '11111306大促奶粉5折306大促奶粉5折306大促奶粉5折306大促奶粉5折',
                time: '2018-2-28  11:11:22',
                status: '已发布',
                rr: '------------'
            }
        ])
    }

    init() {

    }

    toggleState() {
        this.data.isStateShow(!this.data.isStateShow())
    }

    selectState(item, event) {
        let context = ko.contextFor(event.target); //获取绑定元素的上下文;event.target绑定View Model的DOM元素
        let index = context.$index();
        this.data.isStateSelected(item)
        this.data.isStateShow(false)
    }

    edit(item) {
        console.log('edit', item.sku);
    }

    preview(item) {
        console.log('preview', item.sku);
    }

    del(item, event) {
        let self = this
        let context = ko.contextFor(event.target); //获取绑定元素的上下文;event.target绑定View Model的DOM元素
        let index = context.$index();
        console.log(item, index);

        swal({
            text: "确定要删除当前专题吗？",
            icon: "warning",
            dangerMode: true,
            buttons: ['再想想', '删除']
        })
        .then(willDelete => {
            if (willDelete) {
                this.list.splice(index, 1);
                swal("已删除!", {
                    button: false,
                    icon: 'success',
                    timer: 1000
                });
            }
        });

    }
}

export default Table