
import dragula from 'dragula'
import Module, { map } from '@module'

ko.components.register('cp-modules', {

    viewModel: function (params) {

        this.arr = map
        this.arr.forEach(item => {
            item.isExpand = ko.observable(true)
        })

        this.toggle = (item, event) => {
            item.isExpand(!item.isExpand())
            console.log(item.isExpand());
        }

    },

    template: `
        <div class="dss-modules" id="drag-modules">
            <!-- ko foreach: { data: arr, as: 'mods' } -->
            <h2 data-bind="text:mods.title,click:$parent.toggle,css:{collapse:mods.isExpand}"></h2>
            <div class="drag-module" data-bind="visible:mods.isExpand">
                <!-- ko foreach: { data: child, as: 'mod' } -->
                <div data-bind="attr:{'data-type':mod.type}">
                    <i data-bind="style:{'background-image': 'url('+ mod.icon +')'}"></i>
                    <p data-bind="text:mod.title"></p>
                </div>
                <!-- /ko -->
            </div>
            <!-- /ko -->
        </div>
    `
});