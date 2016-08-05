//@author mu @14/4/15
var LOCAL_ORDER = 100
var mainLayer = myLayer.extend({
    sprite: null,
    viedo: null,
    layerName: "mainLayer",
    changeDelete: false, //是否退出删除
    ctor: function() {
        this._super();
        var ui_list = [
            "btn_see",
            "btn_do",
            "btn_learn",
            "btn_show",
            "btn_help",
            "btn_close",
            "btn_start",
            "view_show",
            "img_title",
        ]
        var self = this
        func.loadUI(this, res.mainLayer, ui_list)

         var enter = function(layername) {
            func.changeLayer({
                out: self,
                in : layerControl.getLayer(layername, true),
            })
        }
        
        this.btn_see.addClickEventListener(function() {
            if(mainInfo.seeList.length == 1){
                enter("seeExp1")
                return
            }
               
            func.changeLayer({
                out: self,
                in : layerControl.getLayer("seeLayer")
            })
        })
        this.btn_do.addClickEventListener(function() {
            if(mainInfo.doList.length==1){
                enter("doExp1")
                return
            }
            func.changeLayer({
                out: self,
                in : layerControl.getLayer("doLayer")
            })
        })
        this.btn_show.addClickEventListener(function() {
            if (mainInfo.noShow) //判断秀一秀不能点击
                return
            func.changeLayer({
                out: self,
                in : layerControl.getLayer("showLayer")
            })
        })
        this.btn_learn.addClickEventListener(function() {
            func.changeLayer({
                out: self,
                in : layerControl.getLayer("learnLayer")
            })
        })
        this.btn_help.addClickEventListener(function() {
            func.changeLayer({
                out: self,
                in : layerControl.getLayer("helpLayer"),
                back: "mainLayer"
            })
        })
        this.btn_close.addClickEventListener(function() {
            dialogControl.AddDialog("Exit")
        })
        this.KeyBack = function() {
            dialogControl.AddDialog("Exit")
        }
        self.img_title.setTexture(mainInfo.titleFile)

        if(mainInfo.mainLoop.length == 1){
            self.btn_start.setVisible(true)
            self.btn_start.addClickEventListener(function(){
                func.changeLayer({
                    out: self,
                    in : layerControl.getLayer("videoLayer")
                })
            })
        }else{
            self.btn_start.setVisible(false)
        }
        var self = this
        self.loopnode = self.addLoop(mainInfo.mainLoop)
        if (mainInfo.noSee) //传递参数，判断是否可见看一看按钮
            this.btn_see.setVisible(false)
        if (mainInfo.noDo) //传递参数，判断是否可见做一做按钮
            this.btn_do.setVisible(false)
        if (mainInfo.noStudy) //传递参数，判断是否可见学一学按钮
            this.btn_learn.setVisible(false)
        return true
    },
    myCtor: function() {
        var self = this
        if (self.loopnode) {
            self.loopnode.init()
        }
    },
    myEnter: function() {
        this._super()
    },
    myExit: function() {
    },
    afterCtor: function(){
        playMusic(mainInfo.soundFile)
    },
    addLoop: function(list, offset) {
        offset = offset || cc.p(5, -10)
        var node = new cc.Node()
        var self = this
        var view = self.view_show
        var size = view.getContentSize()
        var startx = size.width / 2
        var height = size.height / 2
        var devide = size.width
        var timePerMove = 2.0
        var timeMove = 0.3
        var minPox = offset.x
        var maxPox = (list.length - 1) * devide + offset.x
        node.list = []
        for (var i = 0; i < list.length; i++) {
            var item = new ccui.ImageView(list[i])
            item.setAnchorPoint(cc.p(0.5, 0.5))
            item.setPosition(i * devide + offset.x, offset.y)
            item.past = i * devide + offset.x
            node.list[i] = item
            node.addChild(item)
        }
        view.addChild(node)
        node.setCascadeOpacityEnabled(true)
        node.setPosition(startx, height)
        var judge = function() {
            for (var i = 0; i < node.list.length; i++) {
                var item = node.list[i]
                addShowType({
                    item: item,
                    show: "moveBy",
                    time: timeMove,
                    buf: cc.p(-devide, 0),
                    fun: function(item) {
                        item.x = item.past - devide
                        if (item.x < minPox) {
                            item.x = maxPox
                        }
                        item.past = item.x
                    },
                })
            }
        }
        if(node.list.length>1)
        addTimer({
            fun: judge,
            repeat: cc.REPEAT_FOREVER,
            time: timePerMove,
            key: "LOOP",
            delay: 0,
            father: self.loadUI,
        })
        node.init = function() {
            this.setOpacity(255)
            for (var i = 0; i < this.list.length; i++) {
                this.list[i].setOpacity(255)
            }
        }
        return node
    },
    update: function(dt) {}
})