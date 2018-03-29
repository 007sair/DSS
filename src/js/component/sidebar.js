ko.components.register('cp-sidebar', {
    viewModel: function (params) {
        // console.log(params);
    },
    template: `
        <div class="dss-sidebar">
            <a href="#page" class="active">
                <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-page"></use></svg>
                <p>页面</p>
            </a>
            <a href="#page">
                <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-caogao"></use></svg>
                <p>草稿</p>
            </a>
        </div>
    `
});