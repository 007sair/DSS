export default {

    // 创建一个16位的唯一标识
    guid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + S4() + S4());
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
    },

    /**
     * 根据传入jq对象，返回一个包含偏移量的对象
     * @param {jQueryObj}  元素，jq对象
     */
    getOffset($el) {
        return {
            top: $el.offset().top,
            left: $el.offset().left + $el.width() + 12
        }
    },

    jsonClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    moveToUp(arr, index) {
        if (index !== 0) {
            arr(this.swapItems(arr(), index, index - 1))
        } else {
            layer.msg('已到顶部', {time: 1000})
        }
    },

    moveToDown(arr, index) {
        if (index !== arr().length - 1) {
            arr(this.swapItems(arr(), index, index + 1))
        } else {
            layer.msg('已到底部', {time: 1000})
        }
    }
}