//@author mu @14/4/27

var tipsDialog = function(data) {
    var ui_list = [
        "btn_close",
        "btn_confirm",
        "img_face_1",
        "img_face_2",
        "img_tip"
    ]
    var node = loadNode(res.tips, ui_list, "bg")
    node.img_tip.rootPos = node.img_tip.getPosition()
        //加载UI
    node.reload = function(data) {
        var texture = data.res
        var face = data.face
        var scale = data.scale
        var sound = data.sound
        var father = data.father
        var confirmBtn = data.confirmBtn || false
        var modify = data.modify || cc.p(0, 0)
        if (scale == null) {
            scale = 1
        }
        var self = this
        self.img_face_1.setVisible(face == 1)
        self.img_face_2.setVisible(face == 2)
        self.img_tip.loadTexture(texture)
        self.img_tip.setContentSize(getSize(texture))
        var root = self.img_tip.rootPos
        var final = cc.p(root.x + modify.x, root.y + modify.y)
        self.img_tip.setPosition(final)
        self.img_tip.setScale(scale)
        self.btn_confirm.setVisible(confirmBtn)
        if (father) {
            safeAdd(father, self)
        }
        if (sound) {
            self.sound = true
            playMusic(sound)
        }else{
            self.sound = false
        }
    }
    node.onIn = function() {
        var self = this
        var node = self
            //放大淡入
        node.setLocalZOrder(LOCAL_ORDER++)
        safeAdd(node.getParent(), node)
        node.setPosition(getMiddle())
        node.setScale(0)
        addShowType({
            item: node,
            show: "scale"
        })
        addShowType({
            item: node,
            show: "fadeIn",
            fun: function(item) {
                createTouchEvent({
                    item: item,
                    begin: function(data) {
                        var item = data.item
                        item.setLocalZOrder(LOCAL_ORDER++)
                        safeAdd(item.getParent(), item)
                        return true
                    },
                    autoMove: true,
                })
            }
        })
    }
    node.onOut = function() {
        var self = this
        var node = self
            //缩小淡出
        addShowType({
            item: node,
            show: "zoom"
        })
        addShowType({
            item: node,
            show: "fadeOut",
            fun: function(item) {
                item.removeListen()
                if(item.sound){
                    stopMusic()
                }
            }
        })
    }
    
    node.btn_close.addClickEventListener(function() {
        node.onOut()
    })
    node.btn_confirm.addClickEventListener(function() {
        node.onOut()
    })
        //添加退出的监听
    node.reload(data)
    
    return node
}