var ResList = [
	"shb",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1,
		res.img_do2
	],
	seeList: [
		res.img_see1
	],
	helpFile: res.sysm,
	titleFile: res.title,
	soundFile:res.sound_title,
	noShow:true,
	mainLoop: [
        res.img_loop_1,
        res.img_loop_2,
        res.img_loop_3
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
		see1:"res/shb_see1.json",
		daoshuiac:"res/shb_daoshuinode.json",
		wenac:"res/shb_wenac.json",
		wenduji_res:"res/shb_wenduji.json",
		miaobiao_res:"res/shb_miaobiao.json",
		daoshui : "res/shb_daoshuiAc.json",
        daoyan : "res/shb_daoyanAc.json",
        jiaoban : "res/shb_jiaobanAc.json",
        jiebing : "res/shb_jiebing.json",
        baowenac : "res/shb_baowenbei.json",
        biaoge1: "res/shb_bg1.json",
        biaoge2: "res/shb_bg2.json",
        ice_ture:"res/shb_ice.json"
	},
	addItems:[
		"tubiao"
	]
}