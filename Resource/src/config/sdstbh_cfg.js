var ResList = [
	"sdstbh",
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
	playMP4:true,
	helpFile: res.sysm,
	titleFile: res.title,
	soundFile:res.sound_title,
	noShow:true,
	mainLoop: [
        res.img_loop_1,
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
		see1:"res/sdstbh_see1.json",
		do1:"res/sdstbh_do1.json",
		do2:"res/sdstbh_do2.json",
		seeac:"res/sdstbh_seenodeAc.json",
		shuidinode:"res/sdstbh_shuidinode.json",
		ronghua:"res/sdstbh_ranhuaAcnode.json",
		chuiac:"res/sdstbh_chuifengjiAcnode.json",
		fengac:"res/sdstbh_fengnode.json",
		shaoziac:"res/sdstbh_shaoziAcnode.json",
		glassnode:"res/sdstbh_glassaction.json",
		bjac:"res/sdstbh_bjac.json",
		shizhi:"res/sdstbh_shizhiAcnode.json"
	}
}