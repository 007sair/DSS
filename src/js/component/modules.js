
import dragula from 'dragula'
import Module, { map } from '@module'
import gd from '@instance/data'

ko.components.register('cp-modules', {

    viewModel: function (params) {
        this.selectedType = ''
        this.isSelectedFlag = ko.observable(false)
        this.arr = map
        this.arr.forEach(item => {
            item.isExpand = ko.observable(true)
            item.child.forEach(child => {
                child.isSelected = ko.observable(false)
            })
        })

        this.toggle = (item, event) => {
            item.isExpand(!item.isExpand())
        }

        this.selected = (item) => {
            this.arr.forEach(items => {
                items.child.forEach(child => {
                    if (item != child) {
                        child.isSelected(false)
                    }
                })
            })
            item.isSelected(!item.isSelected())
            if (item.isSelected()) {
                this.isSelectedFlag(true)
                this.selectedType = item.type
            } else {
                this.isSelectedFlag(false)
            }

        }

        this.addModule = () => {
            let flag = gd.$$preview.views().length
            gd.$$preview.add(this.selectedType, flag)
        }

        // console.log(this.arr);
    },

    template: `
        <div class="dss-modules" id="drag-modules">
            <button data-bind="visible:isSelectedFlag,click:addModule" class="add">添加至末尾</button>
            <!-- ko foreach: { data: arr, as: 'mods' } -->
            <h2 data-bind="text:mods.title,click:$parent.toggle,css:{collapse:mods.isExpand}"></h2>
            <div class="drag-module" data-bind="visible:mods.isExpand">
                <!-- ko foreach: { data: child, as: 'mod' } -->
                <div data-bind="attr:{'data-type':mod.type},click:$component.selected,css:{active:mod.isSelected}">
                    <i data-bind="style:{'background-image': 'url('+ mod.icon +')'}"></i>
                    <p data-bind="text:mod.title"></p>
                </div>
                <!-- /ko -->
            </div>
            <!-- /ko -->
        </div>
    `
});