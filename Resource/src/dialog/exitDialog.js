//@author mu @14/4/15
function CloseWebPage() {
    if (cc.sys.platform == cc.sys.MOBILE_BROWSER || cc.sys.platform == cc.sys.DESKTOP_BROWSER) {
        if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {
            window.location.href = "about:blank";
            window.close();
        } else {
            window.opener = null;
            window.open("", "_self");
            window.close();
        }
    }
}

var exitDialog = cc.Layer.extend({
    sprite: null,
    ctor: function() {
        this._super();
        var ui_list = [
            "btn_confirm",
            "btn_cancel",
        ]
        func.loadUI(this, res.exitNode, ui_list)
        var self = this
        this.btn_confirm.addClickEventListener(function() {
            if (cc.sys.isNative){
                if (cc.sys.os == cc.sys.OS_ANDROID){
                    cc.director.end()
                    //android return
                }else{
                    if(IOS_CONTROLLER && IOS_RETURN_FUNC){
                        if(CC_CURRENT_LAYER){
                            CC_CURRENT_LAYER.setVisible(false)
                        }
                        jsb.reflection.callStaticMethod(IOS_CONTROLLER, IOS_RETURN_FUNC)
                    }
                }
            }else{
                cc.director.end()
                CloseWebPage()
            }
        });
        this.btn_cancel.addClickEventListener(function() {
            self.onOut()
        });
        return true;
    },
    onIn: function() {
        func.addShowType({
            item: this.loadUI,
            show: "scale"
        })
        func.addShowType({
            item: this.loadUI,
            show: "fadeIn"
        })
    },
    onOut: function() {
        func.addShowType({
            item: this.loadUI,
            show: "zoom"
        })
        func.addShowType({
            item: this.loadUI,
            show: "fadeOut"
        })
    }
})