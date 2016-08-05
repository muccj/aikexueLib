var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.bwb_tableNode2_json,
                            scale:0.8,
                            inputNum: 18,
                            //rootColor:cc.color(130, 95, 205, 255),
                        })
                        self.biaoge = bg
                        safeAdd(self, bg)
                    }
                    self.biaoge.show()
                },
            }
        })
        //this.initPeople()
        this.initUI()
        return true;
    },

    initUI: function () {
        var self = this
        loadPlist("do2_plist")
        self.createTool()

        var createBigWdj = function(){
            var layOut = createLayout({
            pos: cc.p(300, 200),
            size: cc.size(103,198),
            })
            self.addChild(layOut)
            layOut.setClippingEnabled(true)
            layOut.setAnchorPoint(0.5,0.5)
            var box = new cc.Sprite("#box.png")
            box.setPosition(300,200)
            self.addChild(box)
            var kd_bg = new cc.Sprite("#kd_bg.png")
            kd_bg.setPosition(50,80)
            layOut.addChild(kd_bg)
            var line = new cc.Sprite("#line.png")
            line.setScaleY(2)
            line.setPosition(52,17.5)
            layOut.addChild(line)
            var kd = new cc.Sprite("#kd.png")
            kd.setPosition(48,98)
            kd.setAnchorPoint(0.35,0.57)
            layOut.addChild(kd)
        }
        

    },

    createTool : function(){
        var self = this
        loadPlist("sbds")
        var somenode = new CreateSomeNode();
        var curLocal = 20
        var toolbtn = createTool({
            pos: cc.p(120, 520),
            nums: 3,
            scale:0.8,
            tri: "down",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.6),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1000, 1000, 1000, 1000,1000,1000,1000],
            swallow: [true, true, true, true, true, true, true],
            files: [res.tools_1, res.tools_2, res.tools_3, res.tools_4,res.tools_5,res.tools_6,res.tools_7],
            gets: ["#bei.png","#sb.png", null,null,"#gai.png","#maojin.png","#paomo.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                if(index == 0){
                    var bei2 = new cc.Sprite("#bei2.png")
                    bei2.setPosition(123,107)
                    item.addChild(bei2)
                }
                if(index == 2){
                    item = somenode.createWenduji()
                    item.x = 100;item.y = -20
                    item.nopos = true
                    item.canback = true
                    somenode.addWendujiEndCallback(function(touch,event,someself){
                        var target = event.getCurrentTarget();
                        if (target.x < 105 && this.toolbtn.getStatus()) {
                            target.getParent().forceBack();
                        }
                    });
                    somenode.addWendujiMoveCallback(function(touch,event,someself){
                         
                    });
                    somenode.removePanelTouch()
                }
                if(index == 3){
                    item = createWatch()
                    item.setScale(0.9)
                }
                if(index == 4){
                    var gai2 = new cc.Sprite("#gai2.png")
                    gai2.setPosition(68,21)
                    gai2.setScale(0.97)
                    item.addChild(gai2)
                }
                item.setLocalZOrder(curLocal)
                return item
            },
            clickfun : function(data){
                var item = data.sp
                var pos = data.pos
                var index = data.index
                if(index == 2)
                    item.canback = true
                item.setLocalZOrder(curLocal)
                curLocal++
                return true
            },
            movefun:function(data){
                var item = data.sp
                var index = data.index
                var delta = data.delta
                item.x += delta.x
                item.y += delta.y
              
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
            }
        });
        this.addChild(toolbtn)
        toolbtn.show()
    }
    
})