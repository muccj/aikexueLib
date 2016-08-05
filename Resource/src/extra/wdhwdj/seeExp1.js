/**
 * Created by Administrator on 2016/7/24.
 */
var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp1",
    preLayer: "seeLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
    	var self = this
        var tmpThis = this
    	var node = loadNode(res.wdhwdj_see1_json)
        self.inside_node.addChild(node)

        self.nodebs.show(function() {
            self.nodebs.say({key:"see1_tip1"})
        })

        var expLayer = node
        var straw = expLayer.getChildByName("xiguan");
        var glass = expLayer.getChildByName("glass1");
        var glass2 = expLayer.getChildByName("glass2");
        var bottle = expLayer.getChildByName("pingzi");   //1left  null bottle
        var bottle2 = expLayer.getChildByName("pingzi2"); //2left have straw null bottle
        var bottle3 = expLayer.getChildByName("pingzi3"); //3right have redweater in glass
        var bottle4 = expLayer.getChildByName("pingzi4"); //4left have back coil
        var bottle5 = expLayer.getChildByName("pingzi5"); //5right have redweater and back coil

        var node = expLayer.getChildByName("Node_2");  //left
        var node2 = expLayer.getChildByName("Node_3"); //up
        var node3 = expLayer.getChildByName("Node_1"); //down
        tmpThis.g1Node = expLayer.getChildByName("Node_4");
        tmpThis.g2Node = expLayer.getChildByName("Node_5");

        var fangda = expLayer.getChildByName("Panel_1");
        tmpThis.bigNode = fangda.getChildByName("bigNode"); //big
        tmpThis.bigNode.removeAllChildren();
        var bigsp  = new cc.Sprite("res/extra/wdhwdj/aniPic/big/fangda002.png");
        bigsp.setAnchorPoint(0.5,0.22);
        tmpThis.bigNode.addChild(bigsp);

        tmpThis.g1Node.removeAllChildren();
        tmpThis.g2Node.removeAllChildren();

        var glasssp = ccs.load(res.wdhwdj_glass2Ani).node;
        tmpThis.g1Node.addChild(glasssp,tmpThis.g1Node.getLocalZOrder());
        var glasssp2 = ccs.load(res.wdhwdj_glass1Ani).node;
        tmpThis.g2Node.addChild(glasssp2,tmpThis.g2Node.getLocalZOrder());


        var hotsp = ccs.load(res.wdhwdj_hotAni).node;
        var hotac = ccs.load(res.wdhwdj_hotAni).action;
        hotsp.setPosition(glass.getPosition());
        tmpThis.addChild(hotsp);
        hotac.gotoFrameAndPlay(0,450,true);
        hotsp.runAction(hotac);

        var pheBtn = expLayer.getChildByName("phebtn");
        straw.setTag(10);
        bottle.setTag(11);
        glass.setTag(12);
        bottle2.setTag(13);
        bottle3.setTag(14);
        bottle4.setTag(15);
        bottle5.setTag(16);
        var strawXY = straw.getPosition();
        var bottle2XY= bottle2.getPosition();
        var bottle4XY = bottle4.getPosition();
        pheBtn.addClickEventListener(function(){
            self.nodebs.say({key:"see1_faxian"})
        })

        var spListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:false,
            //-----------------------touchBegan----------------------
            onTouchBegan: function(touch,event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if(cc.rectContainsPoint(rect,locationInNode)) {
                    if(target.getTag() == 10 ) {
                        target.setRotation(0);
                        target.x = touch.getLocation().x;
                        target.y =touch.getLocation().y-150;
                    }
                    if(target.getTag() == 14 && bottle3.isVisible()){
                        node3.removeAllChildren();
                        bottle3.setVisible(false);
                        var psp = ccs.load(res.wdhwdj_see3Ani).node;
                        var pac = ccs.load(res.wdhwdj_see3Ani).action;
                        node3.addChild(psp,node3.getLocalZOrder());
                        pac.gotoFrameAndPlay(0,5,false);
                        pac.setLastFrameCallFunc(function(){
                            pac.gotoFrameAndPlay(10,540,false);
                            tmpThis.glass1Action(2);
                            tmpThis.glass2Action(2);

                             pac.setLastFrameCallFunc(function(){
                            var call = new cc.CallFunc(function(){
                                var move = new cc.MoveTo(0.3,cc.p(node.getPositionX(),node.getPositionY()-90));
                                psp.runAction(move);
                            });
                            var call2 = new cc.CallFunc(function(){
                                node3.removeAllChildren();
                                node.removeAllChildren();
                                var psp2 = ccs.load(res.wdhwdj_see4Ani).node;
                                var pac2 = ccs.load(res.wdhwdj_see4Ani).action;
                                node.addChild(psp2,node3.getLocalZOrder());
                                pac2.gotoFrameAndPlay(0,90,false);
                                pac2.setLastFrameCallFunc(function(){
                                    node.removeAllChildren();
                                    bottle4.setVisible(true);
                                    pheBtn.setVisible(true);

                                });
                                psp2.runAction(pac2);
                            });

                                 var seq = new cc.Sequence(call,call2);
                                 tmpThis.runAction(seq);
                            });
                        });
                        psp.runAction(pac);

                        var f1 = new cc.CallFunc(function(){
                            tmpThis.bigAction(res.wdhwdj_big3Ani,0,45);
                        });
                        var f2 = new cc.CallFunc(function(){
                            tmpThis.bigAction(res.wdhwdj_big33Ani,0,350);
                        });
                        var f3 = new cc.CallFunc(function(){
                            tmpThis.bigAction(res.wdhwdj_big3Ani,440,640);
                        });
                        var d1 = new cc.DelayTime(0.375);
                        var d2 = new cc.DelayTime(3);
                        var seq = new cc.Sequence(f1,d1,f2,d2,f3);
                        tmpThis.runAction(seq);

                    }
//===========================================================================================================
                    if(target.getTag() == 16 && bottle5.isVisible()){

                        node3.removeAllChildren();
                        bottle5.setVisible(false);
                        var psp = ccs.load(res.wdhwdj_see6Ani).node;
                        var pac = ccs.load(res.wdhwdj_see6Ani).action;
                        node3.addChild(psp,node3.getLocalZOrder());
                        pac.gotoFrameAndPlay(0,5,false);
                        pac.setLastFrameCallFunc(function(){
                            tmpThis.glass1Action(2);
                            tmpThis.glass2Action(2);
                            pac.gotoFrameAndPlay(10,505,false);
                            pac.setLastFrameCallFunc(function(){
                                var call = new cc.CallFunc(function(){
                                    var move = new cc.MoveTo(0.3,cc.p(node.getPositionX(),node.getPositionY()-90));
                                    psp.runAction(move);
                                });
                                var call2 = new cc.CallFunc(function(){
                                    node3.removeAllChildren();
                                    bottle4.setVisible(true);
                                });
                                var seq = new cc.Sequence(call,call2);
                                tmpThis.runAction(seq);
                            });
                        });
                        //tmpThis.bigAction(res.big5Ani,0,505);//505
                        psp.runAction(pac);

                        var f1 = new cc.CallFunc(function(){
                            tmpThis.bigAction(res.wdhwdj_big5Ani,0,50);
                        });
                        var f2 = new cc.CallFunc(function(){
                            tmpThis.bigAction(res.wdhwdj_big55Ani,0,360);
                        });
                        var f3 = new cc.CallFunc(function(){
                            tmpThis.bigAction(res.wdhwdj_big5Ani,400,505);
                        });
                        var d1 = new cc.DelayTime(0.33);
                        var d2 = new cc.DelayTime(3.1);
                        var seq = new cc.Sequence(f1,d1,f2,d2,f3);
                        tmpThis.runAction(seq);
                    }
//===========================================================================================================


                    return true;
                }

                return false;
            },
            //-----------------------touchMove----------------------
            onTouchMoved:function(touch,event){
                var target = event.getCurrentTarget();
                if(target.getTag() == 14 || (target.getTag() == 15 && (!(bottle4.isVisible()))) || target.getTag() == 16){
                    return;
                }
                var delta = touch.getDelta();
                target.x += delta.x;
                target.y += delta.y;

                if(target.getTag() == 10){
                    if(tmpThis.checkDistanceWithPoint(target,bottle)){
                            node.removeAllChildren();
                            var psp = ccs.load(res.wdhwdj_see1Ani).node;
                            var pac = ccs.load(res.wdhwdj_see1Ani).action;
                        straw.removeFromParent(true);
                        bottle.removeFromParent(true);
                            node.addChild(psp);
                            pac.gotoFrameAndPlay(0,290,false);
                            pac.setLastFrameCallFunc(function(){
                                node.removeAllChildren();
                                bottle2.setVisible(true);
                                self.nodebs.say({key:"see1_tip2",force:true})
                            });
                        tmpThis.bigAction(res.wdhwdj_big1Ani,0,290);//290
                        psp.runAction(pac);

                    }
                }

                if(target.getTag() == 13){   //change bottle 3
                    if(tmpThis.checkDistanceWithPoint(target,glass)){
                        bottle2.removeFromParent(true);
                        node2.removeAllChildren();
                        var psp = ccs.load(res.wdhwdj_see2Ani).node;
                        var pac = ccs.load(res.wdhwdj_see2Ani).action;
                        node2.addChild(psp);
                        pac.gotoFrameAndPlay(0,30,false);
                        pac.setLastFrameCallFunc(function(){
                            pac.gotoFrameAndPlay(35,390,false);
                            tmpThis.glass1Action(0);
                            tmpThis.glass2Action(0);
                            pac.setLastFrameCallFunc(function(){
                            node2.removeAllChildren();
                            bottle3.setVisible(true);
                            self.nodebs.say({key:"see1_tip3",force:true})

                            });
                        });

                        //tmpThis.bigAction(res.big2Ani,0,390);//390
                        psp.runAction(pac);

                        var f1 = new cc.CallFunc(function(){
                            tmpThis.bigAction(res.wdhwdj_big2Ani,0,40);
                        });
                        var f2 = new cc.CallFunc(function(){
                            tmpThis.bigAction(res.wdhwdj_big22Ani,0,280);
                        });
                        var f3 = new cc.CallFunc(function(){
                            tmpThis.bigAction(res.wdhwdj_big2Ani,290,390);
                        });
                        var d1 = new cc.DelayTime(0.33);
                        var d2 = new cc.DelayTime(2.33);
                        var seq = new cc.Sequence(f1,d1,f2,d2,f3);
                        tmpThis.runAction(seq);


                    }
                }
                if(target.getTag() == 15 ){     //change bottle4
                    if(tmpThis.checkDistanceWithPoint(target,glass)){
                        bottle4.setVisible(false);
                        node2.removeAllChildren();
                        var psp = ccs.load(res.wdhwdj_see5Ani).node;
                        var pac = ccs.load(res.wdhwdj_see5Ani).action;
                        node2.addChild(psp);
                        pac.gotoFrameAndPlay(0,30,false);
                        pac.setLastFrameCallFunc(function(){
                            tmpThis.glass1Action(0);
                            tmpThis.glass2Action(0);
                            pac.gotoFrameAndPlay(35,265,false);
                            pac.setLastFrameCallFunc(function(){
                            node2.removeAllChildren();
                            bottle5.setVisible(true);
                            });
                        });
                        tmpThis.bigAction(res.wdhwdj_big4Ani,0,265);
                        psp.runAction(pac);

                    }
                }


            },
            //-----------------------touchEnd----------------------
            onTouchEnded:function(touch,event){
                var target = event.getCurrentTarget();
            if(target.getTag() == 10) {
                straw.setRotation(75);
                straw.setPosition(strawXY);
            }
            if(target.getTag() == 13){
                bottle2.setPosition(bottle2XY);
            }
            if(target.getTag() == 15){
                target.setPosition(bottle4XY);
            }
            }
        });
        cc.eventManager.addListener(spListener,straw);
        cc.eventManager.addListener(spListener.clone(),bottle2);
        cc.eventManager.addListener(spListener.clone(),bottle3);
        cc.eventManager.addListener(spListener.clone(),bottle4);
        cc.eventManager.addListener(spListener.clone(),bottle5);

    },

    checkDistanceWithPoint: function(target1,target2){
        var dy = target1.y - target2.y;
        var  dx = target1.x - target2.x;
        var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
        if(distance <= 50){
            return true;
        }else{
            return false;
        }
    },

    glass1Action:function(index){
        var tmpThis = this;
        tmpThis.g1Node.removeAllChildren();
        if(index == 2){
            var glasssp = ccs.load(res.wdhwdj_glass4Ani).node;
            var glassac = ccs.load(res.wdhwdj_glass4Ani).action;
        }else{
            var glasssp = ccs.load(res.wdhwdj_glass2Ani).node;
            var glassac = ccs.load(res.wdhwdj_glass2Ani).action;
        }
        tmpThis.g1Node.addChild(glasssp);
        glassac.gotoFrameAndPlay(0,70,false);
        glassac.setLastFrameCallFunc(function(){
                tmpThis.g1Node.removeAllChildren();
                //var bsp  = new cc.Sprite("res/aniPic/glass/b15.png");
                //bsp.setAnchorPoint(0.5,1);
            if(index ==2){
                var bsp  =  ccs.load(res.wdhwdj_glass2Ani).node;
                tmpThis.g1Node.addChild(bsp);//,tmpThis.g1Node.getLocalZOrder()
            }else{
                 var bsp  =  ccs.load(res.wdhwdj_glass4Ani).node;
                 tmpThis.g1Node.addChild(bsp);//,tmpThis.g1Node.getLocalZOrder()
            }
        });
        glasssp.runAction(glassac);

    },

    bigAction:function(name,frame1,frame2){
        var tmpThis = this;
        tmpThis.bigNode.removeAllChildren();
        var bigsp = ccs.load(name).node;
        var bigac = ccs.load(name).action;
        tmpThis.bigNode.addChild(bigsp);
        bigac.gotoFrameAndPlay(frame1,frame2,false);
        bigsp.runAction(bigac);
    },

    glass2Action:function(index){
        var tmpThis = this;
        tmpThis.g2Node.removeAllChildren();
        if(index == 2){
            var glasssp = ccs.load(res.wdhwdj_glass3Ani).node;
            var glassac = ccs.load(res.wdhwdj_glass3Ani).action;
        }else {
            var glasssp = ccs.load(res.wdhwdj_glass1Ani).node;
            var glassac = ccs.load(res.wdhwdj_glass1Ani).action;
        }
        tmpThis.g2Node.addChild(glasssp);
        glassac.gotoFrameAndPlay(0,70,false);
        glassac.setLastFrameCallFunc(function(){
                tmpThis.g2Node.removeAllChildren();
                //var fsp  = new cc.Sprite("res/aniPic/glass/f15.png");
                //fsp.setAnchorPoint(0.5,1);
            if(index == 2){
                var fsp = ccs.load(res.wdhwdj_glass1Ani).node;
                tmpThis.g2Node.addChild(fsp, tmpThis.g2Node.getLocalZOrder());
            }else {
                var fsp = ccs.load(res.wdhwdj_glass3Ani).node;
                tmpThis.g2Node.addChild(fsp, tmpThis.g2Node.getLocalZOrder());
            }
        });
        glasssp.runAction(glassac);
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see1_tip1",img:res.see1_tip1,sound:res.see1_sound1},
            {key:"see1_tip2",img:res.see1_tip2,sound:res.see1_sound2},
            {key:"see1_tip3",img:res.see1_tip3,sound:res.see1_sound3},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
        	addContent({
            people: this.nodebs,
            key: addList[i].key,
            img: addList[i].img,
            sound: addList[i].sound,
        })
        }
        addContent({
            people: this.nodebs,
            key: "see1_faxian",
            img: res.see1_faxian,
            sound: res.see1_faxian_sound,
            id:"result"
        })
	},
})