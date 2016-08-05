//@author mu @16/5/11

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
            loadPlist("sbrt")
        });
        this.needSet = false
        this._super()
        this.expCtor({
            btnOff: cc.p(130, 8)
        })
        this.initUI()
        this.initData()

        return true
    },
    initUI: function() {
        var self = this;
        var uinamelist = [
            "itemlistbg",
            "commitbtn",
            "daanbtn",
            "againbtn",
            "txt1", "txt2", "txt3",
            "tibg", "qiguanbtn", "gugebtn", "jiroubtn", "ticolse",
            "ti1", "ti2", "ti3"
        ]

        var node = loadNode(res.gcst_do1, uinamelist);
        this.allnode = node
        self.inside_node.addChild(node)

        node.commitbtn.addClickEventListener(function() {
            self.guannode.getJielun()
        })
        node.daanbtn.addClickEventListener(function() {
            self.guannode.showdaan(res.daantip)
        })


        var tiinfo = [{
            btn: node.jiroubtn,
            ti: node.ti1
        }, {
            btn: node.gugebtn,
            ti: node.ti2
        }, {
            btn: node.qiguanbtn,
            ti: node.ti3
        }, ]
        for (var i in tiinfo) {
            tiinfo[i].btn.index = i
            tiinfo[i].btn.addClickEventListener(function(sender, type) {
                for (var k in tiinfo) {
                    tiinfo[k].ti.setVisible(false)
                    tiinfo[k].btn.setBright(true)
                    tiinfo[k].btn.setEnabled(true)
                }

                tiinfo[sender.index].ti.setVisible(true)
                tiinfo[sender.index].btn.setBright(false)
                tiinfo[sender.index].btn.setEnabled(false)
            })
        }



        node.againbtn.setVisible(false)
        node.tibg.retain()
        node.tibg.removeFromParent(false)
        node.tibg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2)
        self.addChild(node.tibg, 99)
        node.tibg.release()
        node.tibg.setScale(0)

        var cankaobtn = new ccui.Button(res.ck_normal, res.ck_select);
        cankaobtn.setPosition(890, 590)
        node.addChild(cankaobtn);

        var outInfun = function() {
            if (node.tibg.getScale()) {
                removeMoving(node.tibg)
                node.tibg.runAction(cc.scaleTo(0.2, 0))
            } else {
                addMoving(node.tibg)
                node.tibg.runAction(cc.scaleTo(0.2, 1))
            }
        }
        node.tibg.changeSelfLocalZero = function() {
            this.setLocalZOrder(LOCAL_ORDER++)
        }
        cankaobtn.addClickEventListener(outInfun)
        node.ticolse.addClickEventListener(outInfun)
    },
    initData: function() {
        var self = this
        self.allnode.txt1.setVisible(true)
        self.allnode.txt2.setVisible(true)
        self.allnode.txt3.setVisible(true)

        this.guannode = func.createGuancha({
            size: cc.size(self.allnode.itemlistbg.width, self.allnode.itemlistbg.height),
            imglist: [
                ["#extra/gcst/sbrt/dtjr.png", "#extra/gcst/sbrt/dtjrd.png", 0],
                ["#extra/gcst/sbrt/fbjr.png", "#extra/gcst/sbrt/fbjrd.png", 0],
                ["#extra/gcst/sbrt/fei.png", "#extra/gcst/sbrt/feid.png", 2],
                ["#extra/gcst/sbrt/kg.png", "#extra/gcst/sbrt/kgd.png", 1],
                ["#extra/gcst/sbrt/lg.png", "#extra/gcst/sbrt/lgd.png", 1],
                ["#extra/gcst/sbrt/qgg.png", "#extra/gcst/sbrt/qggd.png", 1],
                ["#extra/gcst/sbrt/sbjr.png", "#extra/gcst/sbrt/sbjrd.png", 0],
                ["#extra/gcst/sbrt/sg.png", "#extra/gcst/sbrt/sgd.png", 1],
                ["#extra/gcst/sbrt/wei.png", "#extra/gcst/sbrt/weid.png", 2],
                ["#extra/gcst/sbrt/xc.png", "#extra/gcst/sbrt/xcd.png", 2],
                ["#extra/gcst/sbrt/xtjr.png", "#extra/gcst/sbrt/xtjrd.png", 0],
                ["#extra/gcst/sbrt/xz.png", "#extra/gcst/sbrt/xzd.png", 2]
            ],
            rectlist: [
                cc.rect(342, 355, 480, 130),
                cc.rect(342, 211, 480, 130),
                cc.rect(342, 68, 480, 130)
            ],
            fromExp: "do",
            father: self,
            databtnoffset: 30,
            nodeInrect: [
                self.allnode.txt1,
                self.allnode.txt2,
                self.allnode.txt3,
            ]

        })
        this.guannode.setPosition(863, 50)
        this.allnode.addChild(this.guannode)
    },
    myEnter: function() {
        this._super()
    }

})