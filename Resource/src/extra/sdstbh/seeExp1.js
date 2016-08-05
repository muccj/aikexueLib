
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){

        });
        this.expCtor()
        this.initUI()
        this.initPeople()

        return true;
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.seenode2.resume()
            })
        }
    },
    initUI:function(){
        var self = this
        var seenode = ccs.load(res.see1).node;
        this.addChild(seenode);
        var yannode = seenode.getChildByName("yannode");
        yannode.setLocalZOrder(5);
        var shuinode = seenode.getChildByName("shuinode");
        shuinode.setLocalZOrder(6);


        this.seenode2 = ccs.load(res.seeac).node;
        var seenode2Ac = ccs.load(res.seeac).action;
        seenode.addChild(this.seenode2);

        seenode2Ac.gotoFrameAndPlay(0,87,false);
        seenode2Ac.setLastFrameCallFunc(function(){
            var smoke = createWaterAir({
                total: 40,
                width: 30,
                height: 10,
                res: res.img_smoke,
            })
            smoke.setPosition(-10,-5)
            smoke.setScale(0.5)
            yannode.addChild(smoke);

             seenode2Ac.gotoFrameAndPlay(87,183,false);
             seenode2Ac.setLastFrameCallFunc(function(){

                var sdnode = ccs.load(res.shuidinode).node;
                var sdnodeAc = ccs.load(res.shuidinode).action;
                shuinode.addChild(sdnode);
                sdnodeAc.gotoFrameAndPlay(0,120,true);
                sdnode.runAction(sdnodeAc);
                seenode2Ac.gotoFrameAndPlay(183,193,false);
                self.nodebs.say({
                    key:"wenzi1",
                    force:true
                })
                seenode2Ac.setLastFrameCallFunc(function(){
                     seenode2Ac.clearLastFrameCallFunc()
                });
             });
        });

        this.seenode2.runAction(seenode2Ac);
        this.seenode2.pause()
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1000, 130)
        })
        this.addChild(this.nodebs);

        addContent({
            people: this.nodebs,
            key: "wenzi1",
            sound: res.zi1mp,
        })
    }
})

