var ResList = [
	"zqzls",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1
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
		res.img_loop_3,
	],
	layerList: [
		["seeExp1", function() {
			return new seeExp1()
		}],
		["doExp1", function() {
			return new doExp1()
		}],
	],
	addRes: {
	    see1:"res/zqzls_see1.json",
	    do1:"res/zqzls_do1.json",
	    maopao:"res/zqzls_maopao.json",
	    daoshui:"res/zqzls_daoshui.json"
	}
}