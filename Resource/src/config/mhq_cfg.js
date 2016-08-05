var ResList = [
	"mhq",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1
	],
	seeList: [
		res.img_see1,
		res.img_see2,
		res.img_see3
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
		["seeExp2", function() {
			return new seeExp2()
		}],
		["seeExp3", function() {
			return new seeExp3()
		}],
		["doExp1", function() {
			return new doExp1()
		}]
	],
	addRes:{
       see1:"res/mhq_see1.json",
       see2:"res/mhq_see2.json",
       see3:"res/mhq_see3.json",
       do1:"res/mhq_do1.json",
       ranshao:"res/mhq_ranshao.json",
       baoxian:"res/mhq_baoxian.json",
       penfen:"res/mhq_pen.json",
	   cco2:"res/mhq_co2.json",
	   paomoAc:"res/mhq_paomo.json"
	}
}