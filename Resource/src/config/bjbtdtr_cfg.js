/**
 * Created by Administrator on 2016/7/22.
 */
/**
 * Created by Administrator on 2016/7/21.
 */
var ResList = [
    "bjbtdtr",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    //exp:"lsyrs",
    noShow:true,
    doList: [
        res.bjbtdtr_img_do1,
        res.bjbtdtr_img_do2,
    ],
    seeList: [
        res.bjbtdtr_img_see1,
    ],
    helpFile: res.bjbtdtr_sysm,
    titleFile: res.bjbtdtr_title,
    soundFile: res.bjbtdtr_title_sound,
    mainLoop: [
        res.bjbtdtr_loop_1,
        res.bjbtdtr_loop_2,
        res.bjbtdtr_loop_3,
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
        bjbtdtr_see1_json:"res/bjbtdtr_seeExp1.json",
        bjbtdtr_do1_json:"res/bjbtdtr_doExp1.json",
        bjbtdtr_do2_json:"res/bjbtdtr_doExp2.json",
        bjbtdtr_rtlsAni:"res/bjbtdtr_rtlsAni.json",
        bjbtdtr_rtrbAni:"res/bjbtdtr_rtrbAni.json",
        bjbtdtr_dsAni:"res/bjbtdtr_sdsAni.json",
        bjbtdtr_sfewDayAni:"res/bjbtdtr_sfewDayAni.json",
        bjbtdtr_sntAni:"res/bjbtdtr_sntAni.json",
        bjbtdtr_sntAni2:"res/bjbtdtr_sntAni2.json",
        bjbtdtr_sntGrowAni:"res/bjbtdtr_sntGrowAni.json",
        bjbtdtr_sntlsAni:"res/bjbtdtr_sntlsAni.json",
        bjbtdtr_sntrbAni:"res/bjbtdtr_sntrbAni.json",
        bjbtdtr_srtAni:"res/bjbtdtr_srtAni.json",
        bjbtdtr_srtAni2:"res/bjbtdtr_srtAni2.json",
        bjbtdtr_srtGrowAni:"res/bjbtdtr_srtGrowAni.json",
        bjbtdtr_ssAni:"res/bjbtdtr_ssAni.json",
        bjbtdtr_stAni:"res/bjbtdtr_stAni.json",
        bjbtdtr_stAni2:"res/bjbtdtr_stAni2.json",
        bjbtdtr_stGrowAni:"res/bjbtdtr_stGrowAni.json",
        bjbtdtr_stlsAni:"res/bjbtdtr_stlsAni.json",
        bjbtdtr_strbAni:"res/bjbtdtr_strbAni.json",
        bjbtdtr_tableNode:"res/bjbtdtr_tableNode.json",
    }
}