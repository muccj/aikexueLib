/**
 * Created by Administrator on 2016/7/24.
 */
/**
 * Created by Administrator on 2016/7/23.
 */
var ResList = [
    "wdhwdj",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    doList: [
        res.wdhwdj_img_do1,
        res.wdhwdj_img_do2,
    ],
    seeList: [
        res.wdhwdj_img_see1,
    ],
    playMP4:true,
    helpFile: res.wdhwdj_sysm,
    titleFile: res.wdhwdj_title,
    soundFile: res.wdhwdj_title_sound,
    mainLoop: [
         res.wdhwdj_loop_1
    ],
    layerList: [
        ["seeExp1", function() {
            return new seeExp1()
        }],
        ["doExp1", function() {
            return new doExp1()
        }],
        ["doExp2", function() {
            return new doExp2()
        }],
    ],
    addRes: {
        wdhwdj_see1_json:"res/wdhwdj_seeExp1.json",
        wdhwdj_do1_json:"res/wdhwdj_doExp1.json",
        wdhwdj_do2_json:"res/wdhwdj_doExp2.json",
        wdhwdj_tabelNode:"res/wdhwdj_tabelNode.json",
        wdhwdj_see6Ani:"res/wdhwdj_see6Ani.json",
        wdhwdj_see5Ani:"res/wdhwdj_see5Ani.json",
        wdhwdj_see4Ani:"res/wdhwdj_see4Ani.json",
        wdhwdj_see3Ani:"res/wdhwdj_see3Ani.json",
        wdhwdj_see2Ani:"res/wdhwdj_see2Ani.json",
        wdhwdj_see1Ani:"res/wdhwdj_see1Ani.json",
        wdhwdj_hotAni:"res/wdhwdj_hotAni.json",
        wdhwdj_glass4Ani:"res/wdhwdj_glass4Ani.json",
        wdhwdj_glass3Ani:"res/wdhwdj_glass3Ani.json",
        wdhwdj_glass2Ani:"res/wdhwdj_glass2Ani.json",
        wdhwdj_glass1Ani:"res/wdhwdj_glass1Ani.json",
        wdhwdj_big55Ani:"res/wdhwdj_big55Ani.json",
        wdhwdj_big33Ani:"res/wdhwdj_big33Ani.json",
        wdhwdj_big22Ani:"res/wdhwdj_big22Ani.json",
        wdhwdj_big5Ani:"res/wdhwdj_big5Ani.json",
        wdhwdj_big4Ani:"res/wdhwdj_big4Ani.json",
        wdhwdj_big3Ani:"res/wdhwdj_big3Ani.json",
        wdhwdj_big2Ani:"res/wdhwdj_big2Ani.json",
        wdhwdj_big1Ani:"res/wdhwdj_big1Ani.json",
    }
}

for (var i in mainInfo.addRes) {
    res[i] = mainInfo.addRes[i]
}

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}