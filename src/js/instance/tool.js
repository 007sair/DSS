
// 上移 下移
$.fn.moveTo = function (direction) {
    let $el = $(this);
    let $prev = $el.prev(),
        $next = $el.next();

    if (direction === 'up') {
        if ($prev.length) {
            if (+$el.attr('data-level') > +$prev.attr('data-level')) { // 层级过小不可移动
                layer.msg('已到顶部，不可上移', {time: 1000 });
            } else {
                $prev.before($el)
            }
        } else {
            layer.msg('已到顶部', {time: 1000 });
        }
    }
    
    if (direction === 'dn') {
        if ($next.length) {
            $next.after($el)
        } else {
            layer.msg('已到底部', { time: 1000 });
        }
    }
}

export default {

    // 创建一个16位的唯一标识
    guid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + S4() + S4());
    },

    /**
     * 观察data对象，属性发生变化时触发 callback
     * @param {object}      data        对象
     * @param {function}    callback    回调函数，参数说明：
     *  @data       属性变更时的对象
     *  @key        变更属性
     *  @val        旧属性的值
     *  @newVal     新属性的值
     */
    observe(data, callback) {
        let _this = this
        if (!data || typeof data !== 'object') {
            return;
        }
        // 取出所有属性遍历
        Object.keys(data).forEach(function (key) {
            let val = data[key]
            _this.observe(val, callback); // 监听子属性
            Object.defineProperty(data, key, {
                enumerable: true, // 可枚举
                configurable: false, // 不能再define
                get: function () {
                    return val;
                },
                set: function (newVal) {
                    callback(data, key, val, newVal)
                    val = newVal;
                }
            });
        });
    },

    // 调用方式 tool.upload.call(this, callback)
    // 参数 this 为当前input
    upload(callback) {
        let file = this.files[0]
        let fd = new FormData()
        fd.append('imgFile', file)
        $.ajax({
            type: "post",
            url: "http://172.16.96.132:8998/common/uploadFile.ajax",
            data: fd,
            processData: false,
            dataType: "json",
            contentType: false,
            success: function (res) {
                callback && callback(res)
            }
        });
    },

    requestUpload(file, callback) {
        let fd = new FormData();
        fd.append('imgFile', file)
        let idx = this.startLoading('上传中，请稍后..')
        $.ajax({
            type: "post",
            url: "http://172.16.96.132:8998/common/uploadFile.ajax",
            data: fd,
            processData: false,
            dataType: "json",
            contentType: false,
            success: function (res) {
                callback && callback(res)
                layer.close(idx)
            }
        });
    },

    // 开启加载中弹层
    // @return 当前弹层的索引，可通过layer.close(index)关闭
    startLoading(str = '加载中') {
        return layer.msg(str, {
            icon: 16,
            shade: 0.01,
            time: 1e8
        });
    },

    // 数组数据对调
    swapItems(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0]
        return arr
    }
    
}