//@author mu @14/4/15

var helpLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    ctor: function() {
        this._super();
        var ui_list = [
            "btn_home",
            "btn_return",
            "view_help",
        ]
        func.loadUI(this, res.helpLayer, ui_list)
        var self = this
        this.btn_home.addClickEventListener(function() {
            func.changeLayer({
                out: self,
                in : layerControl.getLayer("mainLayer")
            })
        })
        var returnFun = function() {
            var result = "mainLayer"
            if (self.pastLayer) {
                result = self.pastLayer
            }
            func.changeLayer({
                out: self,
                in : layerControl.getLayer(result)
            })
        }
        this.btn_return.addClickEventListener(returnFun)
        this.KeyBack = returnFun
        this.addHelp(mainInfo.helpFile)
        return true
    },
    addHelp: function(res) {
        var item = new ccui.ImageView(res)
        var scale = mainInfo.helpScale || 1
        item.setAnchorPoint(0, 0)
        item.setScale(scale)
        var self = this
        self.view_help.setInnerContainerSize(cc.size(self.view_help.getInnerContainerSize().width, item.getContentSize().height * scale))
        var self = this
        self.helpImg = item
        self.view_help.addChild(item)
    }
})