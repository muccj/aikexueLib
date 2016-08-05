/**
 * Created by Administrator on 2016/7/13.
 */
var ResList = [
    "wzdrj",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    noSee:true,
    doList: [
        res.wzdrj_img_do1,
        res.wzdrj_img_do2,
    ],
    helpFile: res.wzdrj_sysm,
    titleFile: res.wzdrj_title,
    soundFile: res.wzdrj_title_sound,
    mainLoop: [
        res.wzdrj_loop_1,
        res.wzdrj_loop_2,
        res.wzdrj_loop_3,
    ],
    layerList: [
        ["doExp1", function() {
            return new doExp1()
        }],
        ["doExp2", function() {
            return new doExp2()
        }],
    ],
    addRes: {
        wzdrj_learn_json:"res/wzdrj_learnExp.json",
        wzdrj_do1_json:"res/wzdrj_doExp1.json",
        wzdrj_do2_json:"res/wzdrj_doExp2.json",
        wzdrj_table1_json:"res/wzdrj_tableNode.json",
        wzdrj_table2_json:"res/wzdrj_tableNode2.json",
    }
}