//@author mu @16/5/11

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        });
        this._super()
        this.expCtor()
        this.initPeople()
        this.initUI()

        return true
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                // self.nodebs.say({
                //     key: "zi5",
                //     force:true
                // })
            })
        }
    },
    initUI:function(){


        var toolnode = new cc.Node();
        toolnode.x = 0 ; toolnode.y =0;
        this.addChild(toolnode,5);
      
         this.toolbtn = createTool({
            pos:cc.p(105, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.5, 1.2),
            itempos:cc.p(3, -10),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            ifcircle: true,
            firstClick:function(data){
                return true;
            },
            father:toolnode,
            files:[res.zls,res.ws,res.rs,res.ks,res.wdj,res.mb],
            gets:[res.zls,res.ws,res.rs,res.ks,res.wdj,res.mb]
        });
        this.addChild(this.toolbtn,3);
        
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs);

        addContent({
            people: this.nodebs,
            key: "zi5",
            sound: res.zi5mp,
        })
        addContent({
            people: this.nodebs,
            key: "zi6",
            sound: res.zi6mp,
        })    
    }
})