ko.components.register('cp-menu', {
    viewModel: function (params) {
    },
    template: `
        <div class="dss-menu">
            <a href="/" class="logo fl"></a>
            <div class="menu fr">
                <div class="user">
                    <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-user"></use></svg>
                    <span>北京花旺在线商贸有限公司</span>
                </div>
                <a href="#home" class="btn-home">
                    <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-home"></use></svg>
                </a>
                <a href="#cancel" class="btn-cancel">
                    <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-cancel"></use></svg>
                </a>
            </div>
        </div>
    `
});