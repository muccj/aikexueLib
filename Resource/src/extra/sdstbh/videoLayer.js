var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    jumpTolayer:"mainLayer",
    load: function() {   
    },
    ctor: function() {
        this._super();
        var tmpthis = this
        tmpthis.video = new ccui.VideoPlayer(res.yinru);
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
        tmpthis.video.setContentSize(1024 * 0.9, 768 * 0.9);
        tmpthis.video.setPosition(cc.winSize.width / 2-20, cc.winSize.height / 2);
        tmpthis.video.x = cc.winSize.width / 2 - 10;
        tmpthis.video.setScaleY(0.8);
        tmpthis.addChild(tmpthis.video);
        tmpthis.video.play();
        tmpthis.scheduleOnce(function () {
            playMusic(res.baby);
        }, 8);
        tmpthis.scheduleOnce(function () {
            playMusic(res.wodebing);
        }, 22);

        var btn = new ccui.Button(res.img_skip_normal, res.img_skip_select);
        
        tmpthis.scheduleOnce(function () {
           tmpthis.video.removeFromParent();
           btn.setVisible(false)
            func.changeLayer({
                out: tmpthis,
                in : layerControl.getLayer(tmpthis.jumpTolayer)
            })
            getLoopOp(tmpthis)
        }, 34);

        btn.x = 21 * cc.winSize.width / 22;
        btn.y = 1 * cc.winSize.width / 20;
        tmpthis.addChild(btn);
        btn.addClickEventListener(function () {
           tmpthis.video.removeFromParent();
           btn.setVisible(false)
            func.changeLayer({
                out: tmpthis,
                in : layerControl.getLayer(tmpthis.jumpTolayer)
            })
            getLoopOp(tmpthis)
        });
    }
})