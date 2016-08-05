var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    jumpTolayer:"mainLayer",
    load: function() {   
    },
    ctor: function() {
        this._super();
        var tmpthis = this
        tmpthis.video = new ccui.VideoPlayer(res.startMV);
        if(cc.sys.isMobile)
            tmpthis.createVideo();
        else
            tmpthis.scheduleOnce(function(){
                tmpthis.createVideo();
            },0.35);
       
        return true
    },
    createVideo:function(){
        var tmpthis = this;
        tmpthis.video.setContentSize(620*1.49,400*1.3);
        tmpthis.video.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        tmpthis.video.x = cc.winSize.width / 2 - 10;
        //tmpthis.video.setScaleY(0.8);
        tmpthis.addChild(tmpthis.video);
        tmpthis.video.play();
        this.scheduleOnce(function(){
            playMusic(res.yd_sound1);
        },1);
        this.scheduleOnce(function(){
            playMusic(res.yd_sound2);
        },10);
        this.scheduleOnce(function(){
            playMusic(res.yd_sound3);
        },19);
        this.scheduleOnce(function(){
            playMusic(res.yd_sound4);
        },28);
        this.scheduleOnce(function(){
            playMusic(res.yd_sound5);
        },33);
        this.scheduleOnce(function(){
            playMusic(res.yd_sound6);
        },37);

        var btn = new ccui.Button(res.img_skip_normal, res.img_skip_select);
        tmpthis.scheduleOnce(function(){
            tmpthis.video.removeFromParent();
            btn.setVisible(false)
            func.changeLayer({
                out: tmpthis,
                in : layerControl.getLayer(tmpthis.jumpTolayer)
            })
            getLoopOp(tmpthis)
        },60);

        btn.x = 21 * cc.winSize.width / 22;
        btn.y = 1 * cc.winSize.width / 20;
        tmpthis.addChild(btn);
        btn.addClickEventListener(function () {
            tmpthis.video.removeFromParent()
            btn.setVisible(false)
            func.changeLayer({
                out: tmpthis,
                in : layerControl.getLayer(tmpthis.jumpTolayer)
            })
            getLoopOp(tmpthis)
             
            // tmpthis.runHomeScene();
        });
    }
})