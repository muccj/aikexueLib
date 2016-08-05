//authro @mu @2016/5/19
function createWatch() {
	var ui_list = [
		"watch_start",
		"watch_stop",
		"watch_second",
		"watch_minute",
		"item_stop_red",
		"item_start_red",
		"item_fzkd_red",
		"watch_second_red",
		"item_mzkd_red",
		"watch_minute_red",
		"font_resume",
		"arrow_resume",
		"font_start",
		"arrow_start",
		"bg_teach",
		"judge_stop",
	]
	var moveY = 10
	var node = loadNode(res.watch, ui_list, "bg")
	node.redKey = [
		"qdb",
		"fwb",
		"mz",
		"fz",
		"fzkd",
		"mzkd",
	]
	node.redList = [
		"item_start_red",
		"item_stop_red",
		"watch_second_red",
		"watch_minute_red",
		"item_mzkd_red",
		"item_fzkd_red",
	]

	node.judgeList = [
		"item_start_red",
		"judge_stop",
		"watch_second_red",
		"watch_minute_red",
		"item_mzkd_red",
		"item_fzkd_red",
	]

	node.changeTeach = function(data) {
		var item = data.father
		var modify = data.modify || cc.p(0, 0)
		var scale = data.scale || 1
		if (item && item.addChild) {
			node.bg_teach.retain()
			var pos = node.bg_teach.getParent().convertToWorldSpace(node.bg_teach.getPosition())
			node.bg_teach.removeFromParent(false)
			item.addChild(node.bg_teach)
			pos = item.convertToNodeSpace(pos)
			node.bg_teach.setPosition(cc.p(pos.x + modify.x, pos.y + modify.y))
			node.bg_teach.setScale(scale)
			node.bg_teach.release()
		}
		return node.bg_teach
	}
	node.showRed = function(key) {
		var node = this
		for (var i = 0; i < node.redKey.length; i++) {
			if (key == node.redKey[i]) {
				node[node.redList[i]].setVisible(true)
			} else {
				node[node.redList[i]].setVisible(false)
			}
		}
	}
	node.setGuideFunc = function(key, buf, fun) {
		if (key && fun) {
			node[sprintf("guideBuf%s", key)] = buf
			node[sprintf("guideFunc%s", key)] = fun

			var result = null
			for (var i = 0; i < node.redKey.length; i++) {
				if (key == node.redKey[i]) {
					result = i
					break
				}
			}
			var temp = node[node.judgeList[result]]
			temp.myName = node.redKey[result]
			createTouchEvent({
				item: temp,
				begin: function(data) {
					var item = data.item
					if (!node.hasClick) {
						node.hasClick = true
						var fun = node[sprintf("guideFunc%s", item.myName)]
						var buf = node[sprintf("guideBuf%s", item.myName)]
						if (fun) {
							fun(buf)
						}
						return true
					}
					return false
				},
				end: function(data) {
					node.hasClick = false
				}
			})

		}
	}
	node.init = function() {
		node.watch_start.rootY = node.watch_start.getPositionY()
		node.watch_stop.rootY = node.watch_stop.getPositionY()
		node.watch_second.rootRotate = node.watch_second.getRotationX()
		node.watch_minute.rootRotate = node.watch_minute.getRotationX()
		node.font_resume.setVisible(false)
		node.arrow_resume.setVisible(false)
		node.font_start.setVisible(false)
		node.arrow_start.setVisible(false)
		node.item_stop_red.setLocalZOrder(-1)
		node.item_start_red.setLocalZOrder(-1)
		node.watch_start.setLocalZOrder(1)
		node.watch_stop.setLocalZOrder(1)
		node.judge_stop.setVisible(false)
		node.judge_stop.setLocalZOrder(999)

		addShowType({
			item: node.arrow_resume,
			show: "moveBackForever",
			time: 0.3,
			buf: cc.p(0, -10),
		})
		addShowType({
			item: node.arrow_start,
			show: "moveBackForever",
			time: 0.3,
			buf: cc.p(0, -10),
		})
		var list = [
			"item_stop_red",
			"item_start_red",
			"item_fzkd_red",
			"watch_second_red",
			"item_mzkd_red",
			"watch_minute_red",
		]
		for (var i = 0; i < list.length; i++) {
			node[list[i]].setVisible(false)
		}
	}
	node.init()

	node.setTime = function(time) {
		node.changeStatus("stop")
		node.watch_second.setRotation(time % 30 / 30 * 360 + node.watch_second.rootRotate)
		node.watch_minute.setRotation(time / 60 / 15 * 360 + node.watch_minute.rootRotate)
	}
	node.getTime = function() {
		var rotateMin = node.watch_minute.getRotationX() - node.watch_minute.rootRotate
		var rotateSec = node.watch_second.getRotationX() - node.watch_second.rootRotate
		var minus = Math.floor(rotateMin % 360 / (360 / 30))
		var second = rotateSec % 360 / 360 * 30
		return minus * 30 + second
	}
	node.changeStatus = function(statu, teachData) {
		var node = this
		for (var i = 0; i < node.status.length; i++) {
			if (statu == node.status[i][0]) {
				node.statu = statu
				node.status[i][1](teachData)
				return
			}
		}
	}
	node.showTeach = function(statu, inout) {
		inout = inout || false
		var item = null
		var font = null
		switch (statu) {
			case "stop":
				item = node.arrow_resume
				font = node.font_resume
				break
			case "start":
				item = node.arrow_start
				font = node.font_start
				break
		}
		if(item){
			item.setVisible(inout)
		}
		if(font){
			font.setVisible(inout)
		}
	}
	node.stop = function(teachData) {
		var tempClear = function() {
			removeTimer("TEACH_STOP")
			removeTimer("TEACH_STOP_BEFORE")
			node.watch_second.stopAllActions()
			node.watch_minute.stopAllActions()
			node.watch_second.setRotation(node.watch_second.rootRotate)
			node.watch_minute.setRotation(node.watch_minute.rootRotate)
			node.showTeach("stop", false)
		}
		if (teachData) {
			var time = teachData.time
			var afterFun = teachData.afterFun
			var beforeFun = teachData.beforeFun
			var delay = teachData.delay || 0.1
			var judgeFun = teachData.judgeFun || function() {
				return true
			}
			var item = node.watch_stop
			if (judgeFun()) {
				removeTimer("TEACH_STOP")
				removeTimer("TEACH_STOP_BEFORE")
				node.showTeach("stop", true)
				addTimer({
					fun: function() {
						if (judgeFun()) {
							removeTimer("TEACH_STOP_BEFORE")
							node.watch_second.stopAllActions()
							node.watch_minute.stopAllActions()
							node.watch_second.setRotation(node.watch_second.rootRotate)
							node.watch_minute.setRotation(node.watch_minute.rootRotate)
							item.y = item.rootY - moveY
							if (beforeFun) {
								beforeFun()
							}
							addTimer({
								fun: function() {
									if (judgeFun()) {
										removeTimer("TEACH_STOP")
										item.y = item.rootY
										if (afterFun) {
											afterFun()
										}
										node.showTeach("stop", false)
									} else {
										tempClear()
									}
								},
								time: time,
								repeat: 1,
								key: "TEACH_STOP",
							})
						} else {
							tempClear()
						}
					},
					time: delay,
					repeat: 1,
					key: "TEACH_STOP_BEFORE",
				})
			} else {
				tempClear()
			}
		} else {
			tempClear()
		}
	}

	node.showClick = function(data) {
		var statu = data.statu
		var time = data.time
		var fun = data.fun
		var item = null
		var backFun = null
		var beforeFun = null
		switch (statu) {
			case "stop":
				item = node.watch_stop
				beforeFun = node.clickStopBefore
				BackFun = node.clickStopBack
				break
			case "start":
			case "pause":
				item = node.watch_start
				beforeFun = node.clickStartBefore
				BackFun = node.clickStartBack
				break
		}
		removeTimer("SHOWCLICK")
		if (beforeFun) {
			beforeFun()
		}
		node.changeStatus(statu)
		item.y = item.rootY - moveY
		addTimer({
			fun: function() {
				removeTimer("SHOWCLICK")
				if (BackFun) {
					BackFun()
				}
				if (fun) {
					fun()
				}
				item.y = item.rootY
			},
			repeat: 0,
			key: "SHOWCLICK",
			time: time,
		})
	}

	node.start = function(teachData) {
		var tempClear = function() {
			removeTimer("TEACH_START")
			removeTimer("TEACH_START_BEFORE")
			addShowType({
				item: node.watch_second,
				show: "circle",
				time: 30,
			})
			addShowType({
				item: node.watch_minute,
				show: "circle",
				time: 15 * 60,
			})
			node.showTeach("start", false)
		}
		if (teachData) {
			var time = teachData.time
			var afterFun = teachData.afterFun
			var beforeFun = teachData.beforeFun
			var delay = teachData.delay || 0.1
			var judgeFun = teachData.judgeFun || function() {
				return true
			}
			var item = node.watch_start
			if (judgeFun()) {
				removeTimer("TEACH_START_BEFORE")
				removeTimer("TEACH_START")
				node.showTeach("start", true)
				addTimer({
					fun: function() {
						if (judgeFun()) {
							removeTimer("TEACH_START_BEFORE")
							addShowType({
								item: node.watch_second,
								show: "circle",
								time: 30,
							})
							addShowType({
								item: node.watch_minute,
								show: "circle",
								time: 15 * 60,
							})

							item.y = item.rootY - moveY
							if (beforeFun) {
								beforeFun()
							}
							addTimer({
								fun: function() {
									if (judgeFun()) {
										removeTimer("TEACH_START")
										item.y = item.rootY
										if (afterFun) {
											afterFun()
										}
										node.showTeach("start", false)
									} else {
										tempClear()
									}
								},
								time: time,
								repeat: 0,
								key: "TEACH_START",
							})
						} else {
							tempClear()
						}
					},
					time: delay,
					repeat: 0,
					key: "TEACH_START_BEFORE",
				})
			} else {
				tempClear()
			}
		} else {
			tempClear()
		}
	}
	node.pause = function() {
		node.watch_second.pause()
		node.watch_minute.pause()
	}
	node.resume = function() {
		node.watch_second.resume()
		node.watch_minute.resume()
	}
	node.status = [
		["start", node.start],
		["stop", node.stop],
		["pause", node.pause],
		["resume", node.resume],
	]
	node.setUse = function(can) {
		node.canUse = can
	}
	node.canUse = true
	node.changeStatus("stop")
	createTouchEvent({
		item: node.watch_start,
		begin: function(data) {
			if (node.canUse) {
				var item = data.item
				var pos = data.pos
				var locationInNode = item.convertToNodeSpace(pos)
				var s = item.getContentSize()
				var rect = cc.rect(0, 0, s.width, s.height)
				if (cc.rectContainsPoint(rect, locationInNode)) {
					item.y = item.rootY - moveY
					if (node.clickStartBefore) {
						node.clickStartBefore()
					}
					return true
				}
			}
			return false
		},
		end: function(data) {
			var item = data.item
			item.y = item.rootY
			switch (node.statu) {
				case "start":
					node.changeStatus("pause")
					break
				case "pause":
					node.changeStatus("resume")
					node.statu = "start"
					break
				case "stop":
					node.changeStatus("start")
					break
				case "resume":
					cc.log("wrong!")
					break
			}
			if (node.clickStartBack) {
				node.clickStartBack()
			}
		}
	})

	createTouchEvent({
			item: node.watch_stop,
			begin: function(data) {
				if (node.canUse) {
					var item = data.item
					var pos = data.pos
					var locationInNode = item.convertToNodeSpace(pos)
					var s = item.getContentSize()
					var rect = cc.rect(0, 0, s.width, s.height)
					if (cc.rectContainsPoint(rect, locationInNode)) {
						item.y = item.rootY - moveY
						if (node.clickStopBefore) {
							node.clickStopBefore()
						}
						return true
					}
				}
				return false
			},
			end: function(data) {
				var item = data.item
				item.y = item.rootY
				node.changeStatus("stop")
				if (node.clickStopBack) {
					node.clickStopBack()
				}
			}
		})
		//addMoving(node.bg, false)
	node.setBack = function(data) {
		var statu = data.statu
		var fun = data.fun
		var before = data.before
		switch (statu) {
			case "stop":
				node.clickStopBefore = before
				node.clickStopBack = fun
				break
			case "start":
				node.clickStartBefore = before
				node.clickStartBack = fun
				break
		}
	}
	return node
}

function createCar(data) {
	var type = data.type
	var tri = data.tri
	var judgeFun = data.judgeFun
	var scale = 0.35
	var ui = [
		"car",
		"cl_1",
		"cl_2",
		"unvis",
	]
	var node = loadNode(res.car, ui)
	node.unvis.setVisible(false)
	node.cir = node.cl_1.getContentSize().width
	node.judge = tri == "left" ? -1 : 1
	if (type != "blue") {
		node.car.setTexture(node.unvis.getTexture())
	}
	if (tri == "right") {
		var mix = 15
		node.car.setFlippedX(true)
		node.cl_1.setPositionX(node.cl_1.getPositionX() - mix)
		node.cl_2.setPositionX(node.cl_2.getPositionX() - mix)
	}

	node.start = function(data) { //xx/s
		var speed = data.speed
		var time = data.time || 1
		var repeat = data.repeat || 9999
		this.myStop()
		addShowType({
			item: this,
			show: "moveBy",
			infun: function() {
				judgeFun(node)
			},
			buf: cc.p(this.judge * speed, 0),
			time: time,
			repeat: repeat
		})
		var cicle = speed / this.cir / Math.PI * 180 / scale
		var loop = [
			this.cl_1,
			this.cl_2
		]
		for (var i = 0; i < loop.length; i++) {
			addShowType({
				item: loop[i],
				show: "rotateBy",
				buf: cicle * this.judge,
				time: time,
				repeat: repeat
			})
		}
	}
	node.myStop = function() {
		this.stopAllActions()
		this.cl_1.stopAllActions()
		this.cl_2.stopAllActions()
	}
	node.myPause = function() {
		this.pause()
		this.cl_1.pause()
		this.cl_2.pause()
	}
	node.myResume = function() {
		this.resume()
		this.cl_1.resume()
		this.cl_2.resume()
	}
	node.setScale(scale)
	return node
}

function createFDJ(data) {
	data = data || {}
	var father = data.father
	var max = data.max || 1
	var min = data.min || 0.1
	var perscale = data.perscale || 0.1
	var nums = data.nums || 1 //放大镜数量
	var seePos = data.seePos || cc.p(700, 270) //视图框位置
	var getPos = data.getPos || cc.p(0, 0) //取景框位置
	var type = data.type || 0
	var rootScale = data.rootScale || 0.4
	type = judgeList({
		src: type,
		dest: 0,
		nums: nums,
	})
	seePos = judgeList({
		src: seePos,
		dest: cc.p(700, 270),
		nums: nums,
	})
	getPos = judgeList({
		src: getPos,
		dest: cc.p(0, 0),
		nums: nums,
	})
	rootScale = judgeList({
		src: rootScale,
		dest: 0.4,
		nums: nums,
	})
	var scale = data.maxScale || 5
	if (!father) {
		return
	}

	var fdjList = [
		[res.img_fdj, res.img_fdj_back],
		[res.img_fdj2, res.img_fdj_back2],
		[res.img_fdj3, res.img_fdj_back3],
	]

	var allTargets = []

	var insideCreateItem = function(data) {
		var index = data.index
		var back = data.back || fdjList[type[index]][1]
		var front = data.front || fdjList[type[index]][0]
		var inside = new cc.ClippingNode(new cc.Sprite(back))
		var outside = new cc.ClippingNode(new cc.Sprite(back))
		inside.setAlphaThreshold(0)
		outside.setAlphaThreshold(0)
		var fr = new cc.Sprite(front)
		fr.addChild(outside)
		outside.addChild(inside)
		fr.setPosition(getMiddle())
		fr.setAnchorPoint(0, 0)
		outside.setPosition(cc.p(fr.getContentSize().width / 2, fr.getContentSize().height / 2))
		fr.inside = inside
		var target = new cc.Node()
		target.setPosition(cc.p(-fr.getContentSize().width / 2, -fr.getContentSize().height / 2))
		var btn_list = [
			"sx",
			"fd",
			"close",
		]
		var devide = 35
		for (var i = 0; i < btn_list.length; i++) {
			var normal = res[sprintf("btn_fdj_%s_normal", btn_list[i])]
			var select = res[sprintf("btn_fdj_%s_select", btn_list[i])]
			var btn = new ccui.Button(normal, select)
			btn.setAnchorPoint(0, 0)
			btn.setPosition(fr.getContentSize().width - devide * btn_list.length + i * devide, fr.getContentSize().height)
			fr[btn_list[i]] = btn
			fr.addChild(btn)
		}
		fr.close.addClickEventListener(function() {
			fr.setVisible(false)
			removeMoving(fr)
		})
		fr.fd.addClickEventListener(function() {
			var link = fr.link
			if (link && link.getScale() > (min + perscale)) {
				link.setScale(link.getScale() - perscale)
				fr.inside.setScale(1 / link.getScale())
			}
		})
		fr.sx.addClickEventListener(function() {
			var link = fr.link
			if (link && link.getScale() < (max - perscale)) {
				link.setScale(link.getScale() + perscale)
				fr.inside.setScale(1 / link.getScale())
			}
		})
		var link = new cc.Sprite(front)
		link.setAnchorPoint(0.5, 0.5)
		fr.link = link
		link.setPosition(link.getContentSize().width / 2, link.getContentSize().height / 2)
		father.addChild(fr)
		father.addChild(link)
		fr.inside.addChild(target)
		allTargets[index] = target
		return {
			fr: fr,
			link: link,
		}
	}

	var node = new cc.Node()
	node.setPosition(0, 0)
	node.setAnchorPoint(0, 0)
	father.addChild(node)
	node.setCascadeOpacityEnabled(true)
	var links = []
	var frs = []
	for (var i = 0; i < nums; i++) {
		var temp = insideCreateItem({
			index: i,
		})
		links[i] = temp.link
		frs[i] = temp.fr
	}
	var result = {
		node: node,
		get: links,
		see: frs,
	}
	result.Init = function() {
		var node = this
		for (var i = 0; i < node.see.length; i++) {
			node.see[i].setPosition(seePos[i])
			node.get[i].setScale(rootScale[i])
			node.see[i].inside.setScale(1 / rootScale[i])
			node.get[i].setVisible(false)
			node.see[i].setVisible(false)
			node.setGet(getPos[i], i)
		}
	}

	result.setGet = function(pos, index) {
		var node = this
		var links = node.get
		index = index || 0
		var from = links[index].getPosition()
		var delta = cc.p(pos.x - from.x, pos.y - from.y)
		node.move(delta, index)
	}

	result.runData = function(data) {
		var key = data.key
		var fun = data.fun
		var judgeNode = false
		for (var i = 0; i < allTargets.length; i++) {
			if (node[key] && allTargets[i][key]) {
				if (!judgeNode) {
					fun({
						all: node,
						item: node[key],
					})
					judgeNode = true
				}
				fun({
					all: allTargets[i],
					item: allTargets[i][key],
				})
			}
		}
	}

	result.getKey = function(key, index) {
		index = index || 0
		return (node[key] && allTargets[index][key])
	}

	result.getOut = function(key) {
		if (node[key]) {
			return node[key]
		}
	}

	result.deleteInside = function(key) {
		for (var i = 0; i < allTargets.length; i++) {
			if (allTargets[i][key]) {
				var item = allTargets[i][key]
				item.stopAllActions()
				item.removeFromParent(true)
				allTargets[i][key] = null
			}
		}
	}

	result.deleteOutside = function(key) {
		if (node[key]) {
			var item = node[key]
			item.stopAllActions()
			item.removeFromParent(true)
			node[key] = null
		}
	}

	result.deleteKey = function(key) {
		this.deleteInside(key)
		this.deleteOutside(key)
	}

	result.createNew = function(data) {
		var key = data.key
		var fun = data.fun
		var father = data.father
		var begin = data.begin
		var move = data.move
		var end = data.end
		var init = data.init
		var inMove = data.inMove
		var outMove = data.outMove
		var buf = data.buf


		var item1 = fun(buf)
		var item2 = []
		node[key] = item1

		if (!father) {
			node.addChild(item1)
		} else {
			node[father].addChild(item1)
		}
		if (init) {
			init({
				item: item1
			})
		}
		for (var i = 0; i < allTargets.length; i++) {
			var temp = fun(buf)
			allTargets[i][key] = temp
			item2[i] = temp
			if (!father) {
				allTargets[i].addChild(temp)
			} else {
				allTargets[i][father].addChild(temp)
			}
			if (init) {
				init({
					item: temp
				})
			}
		}
		item1.linkFun = function(fun) {
			if (fun) {
				for (var i = 0; i < item2.length; i++) {
					fun({
							item: item2[i],
							all: allTargets[i],
						}) //mark data all item
				}
			}
		}

		if (begin || move || end || inMove || outMove) {
			createTouchEvent({
				item: item1,
				begin: function(data) {
					if (begin) {
						for (var i = 0; i < item2.length; i++) {
							var item = item2[i]
							var pos = data.pos
							begin({
								item: item,
								pos: pos,
							})
						}
						return begin(data)
					}
					return true
				},
				move: function(data) {
					if (move) {
						move(data)
						for (var i = 0; i < item2.length; i++) {
							data.item = item2[i]
							move(data)
						}
					}
					if (inMove) {
						for (var i = 0; i < item2.length; i++) {
							data.item = item2[i]
							inMove(data)
						}
					}
					if (outMove) {
						data.item = item1
						outMove(data)
					}
				},
				end: function(data) {
					if (end) {
						end(data)
						for (var i = 0; i < item2.length; i++) {
							data.item = item2[i]
							end(data)
						}
					}
				}
			})
		}
	}

	//target.setScale(1 / scale)

	result.move = function(delta, index) {
		index = index || 0
		var node = this
		var links = node.get

		links[index].x += delta.x
		links[index].y += delta.y
		allTargets[index].x -= delta.x
		allTargets[index].y -= delta.y
	}
	result.actMove = function(data) {
		var result = this
		data = data || {}
		var links = result.get
		var frs = result.see
		var index = data.index
		var judgeGet = data.judgeGet
		for (var i = 0; i < links.length; i++) {
			if (index == null || (index != null && i == index)) {
				links[i].judgeIndex = i
				createTouchEvent({
					item: links[i],
					begin: function(data) {
						var item = data.item
						return item.isVisible()
					},
					move: function(data) {
						var item = data.item
						var pos = data.pos
						var delta = data.delta
						var fr = frs[item.judgeIndex]
						if (!fr.isVisible()) {
							addMoving(fr)
							fr.setVisible(true)
						}
						if (judgeGet) {
							var final = judgeGet({
								index: item.judgeIndex,
								delta: delta,
								item: item,
								pos: pos,
							})
							if (final != null) {
								delta = final
							}
						}
						result.move(delta, item.judgeIndex)
					}
				})
				if (frs[i].isVisible()) {
					addMoving(frs[i])
				}
			}
		}
	}
	result.Init()
	return result
}

function createCounter() {
	var list = [
		"back", "off", "c", "mc", "mr", "ms", "m+",
		"add", "close", "equal", "minus",
		"div", "point", "1/x", "x", "0", "1", "2", "3",
		"4", "5", "6", "7", "8", "9", "%", "sprt", "+/-",
	]
	var templist = []
	for (var i = 0; i < list.length; i++) {
		templist[i] = "btn_" + list[i]
	}
	templist[templist.length] = "img_kuang"

	var counter = function() {
		var node = loadNode(res.counter, templist, "bg")
		var dataControl = {}
		dataControl.limit = 12 //nums limit
		dataControl.buf = ""
		dataControl.past = null
		dataControl.option = null
		var judgeMlist = function(str) {
			var mlist = [
				"mr", "ms", "m+", "mc"
			]
			for (var i = 0; i < mlist.length; i++) {
				if (str == mlist[i]) {
					switch (str) {
						case "ms":
							if (!node.store) {
								node.store = new cc.LabelBMFont("", res.counterfnt)
								node.store.setAlignment(cc.TEXT_ALIGNMENT_LEFT)
								node.store.setAnchorPoint(1, 0.5)
								node.store.setScale(2)
								node.store.setString(String.fromCharCode(77))
								var size = node.img_kuang.getContentSize()
								var offset = cc.p(50, 0)
								node.store.setPosition(offset.x, size.height / 2 + offset.y)
								node.img_kuang.addChild(node.store)
							}
							node.store.setVisible(true)
							var buf = dataControl.buf
							if (buf == "") {
								buf = "0"
							}
							dataControl.storage = buf
							break
						case "mc":
							if (node.store) {
								node.store.setVisible(false)
							}
							dataControl.storage = null
							break
						case "mr":
							if (dataControl.storage) {
								dataControl.buf = dataControl.storage
								dataControl.needRestart = false
							}
							break
						case "m+":
							if (dataControl.storage) {
								var store = parseFloat(dataControl.storage)
								var buf = dataControl.buf
								if (buf == "") {
									buf = "0"
								}
								buf = parseFloat(buf)
								dataControl.storage = (store + buf).toString()
							}
							break
					}
					return true
				}
			}
			return false
		}

		var judgeOp = function(str) {
			var oplist = [
				"add", "minus", "div", "x", "equal",
			]
			for (var i = 0; i < oplist.length; i++) {
				if (str == oplist[i]) {
					return true
				}
			}
			return false
		}

		var clearPast = function() {
			dataControl.past = null
			dataControl.option = null
		}

		var countPast = function() {
			if (dataControl.past && dataControl.option && !dataControl.needRestart) {
				var buf = parseFloat(dataControl.buf)
				var past = parseFloat(dataControl.past)
				var result = null
				switch (dataControl.option) {
					case "add":
						result = buf + past
						break
					case "minus":
						result = past - buf
						break
					case "div":
						result = past / buf
						break
					case "x":
						result = past * buf
						break
					case "equal":
						result = buf
						break
				}
				dataControl.buf = result.toString()
			}
		}

		var getPast = function(str) {
			dataControl.past = dataControl.buf
			dataControl.option = str
		}

		var judgeReset = function() {
			if (dataControl.needRestart) {
				dataControl.buf = "0"
			}
			return dataControl.buf
		}

		var link = function(str) {
			var buf = dataControl.buf
			if (buf == "") {
				buf = "0"
			}
			if (judgeNum(str)) {
				buf = judgeReset()
				buf = buf + str
				dataControl.buf = buf
				dataControl.needRestart = false
				return show()
			}
			if (str == "point") {
				buf = judgeReset()
				if (!judgeContain(buf, ".")) {
					buf = buf + "."
				}
				dataControl.buf = buf
				dataControl.needRestart = false
				return show()
			}
			if (str == "c") {
				dataControl.buf = ""
				clearPast()
				return show()
			}
			if (str == "back") {
				if (buf.length > 0) {
					buf = buf.substr(0, buf.length - 1)
					dataControl.buf = buf
				}
				dataControl.needRestart = false
				return show()
			}
			if (str == "sprt") {
				var temp = Math.sqrt(parseFloat(buf))
				buf = temp.toString()
				dataControl.buf = buf
				clearPast()
				return show()
			}
			if (str == "+/-") {
				dataControl.buf = (parseFloat(buf) * -1).toString()
				dataControl.needRestart = false
				return show()
			}
			if (str == "1/x") {
				dataControl.buf = (1 / parseFloat(buf)).toString()
				clearPast()
				return show()
			}
			if (judgeOp(str)) {
				countPast()
				getPast(str)
				dataControl.needRestart = true
				return show()
			}
			if (judgeMlist(str)) {
				return show()
			}
			if (str == "close" || str == "off") {
				node.close()
				return
			}
		}
		var judgeResult = function(str) {
			var result = str
			for (var i = 0; i < str.length; i++) {
				if (str[i] == "e" || str[i] == "E") {
					result = str.substr(0, (dataControl.limit - str.length + i)) + str.substr(i, str.length)
					break
				}
			}
			return result
		}
		var show = function() {
			if (!node.label) {
				node.label = new cc.LabelBMFont("", res.counterfnt)
				node.label.setAlignment(cc.TEXT_ALIGNMENT_RIGHT)
				node.label.setAnchorPoint(1, 0.5)
				node.label.setScale(2)
				var size = node.img_kuang.getContentSize()
				var offset = cc.p(-15, 0)
				node.label.setPosition(size.width + offset.x, size.height / 2 + offset.y)
				node.img_kuang.addChild(node.label)
			}
			if (dataControl.buf == "") {
				dataControl.buf = "0"
			}
			var ifpoint = false
			if (dataControl.buf[dataControl.buf.length - 1] == ".") {
				ifpoint = true
			}
			dataControl.buf = judgeResult(dataControl.buf)
			if (dataControl.buf.length > dataControl.limit) {
				dataControl.buf = dataControl.buf.substr(0, dataControl.limit)
			}
			dataControl.buf = parseFloat(dataControl.buf).toString()
			if (ifpoint && !judgeContain(dataControl.buf, ".")) {
				dataControl.buf = dataControl.buf + "."
			}
			node.label.setString(dataControl.buf)
		}
		for (var i = 0; i < templist.length - 1; i++) {
			node[templist[i]].key = list[i]
			node[templist[i]].addClickEventListener(function() {
				link(this.key)
			})
		}
		show()
		node.setLocalZOrder(999)
		node.setScale(0)

		node.show = function() {
			var node = this
			if (!node.showing) {
				node.showing = true
				node.setPosition(getMiddle())
				node.setLocalZOrder(LOCAL_ORDER++)
				addShowType({
					item: node,
					show: "scale",
					time: 0.3,
					scale: 0.8,
					fun: function(item) {
						item.showing = false
						node.act = true
						createTouchEvent({
							item: item,
							begin: function(data) {
								var item = data.item
								item.setLocalZOrder(LOCAL_ORDER++)
								return true
							},
							move: function(data) {
								var item = data.item
								var delta = data.delta
								item.x += delta.x
								item.y += delta.y
							}
						})
					}
				})
			}
		}

		node.close = function() {
			var node = this
			if (!node.showing) {
				node.showing = true
				addShowType({
					item: node,
					show: "zoom",
					time: 0.3,
					fun: function(item) {
						item.showing = false
						node.act = false
						if (item.removeListen) {
							item.removeListen()
						}
					}
				})
			}
		}
		node.reEnter = function() {
			if (node) {
				node.label.setOpacity(255)
			}
		}
		node.setLocalZOrder(LOCAL_ORDER++)
		return node
	}

	return counter()
}

function createRuler(data) {
	var scale = data.scale || 1
	var devide = data.devide || 18
	var max = data.max
	var height = data.height || 60
	var add = data.add || 2
	var width = data.width || ((max + add) * devide)
	var littlediv = devide / 10
	var labeldix = 30
	var updix = 5
	var seg = data.seg || 0.35 * scale
	var lineModify = data.lineModify || cc.p(0, 0)
	var fontModify = data.fontModify || cc.p(0, 0)
	var rotate = data.rotate || 0

	devide *= scale
	height *= scale
	width *= scale
	labeldix *= scale
	updix *= scale
	littlediv *= scale

	var bg = new cc.Scale9Sprite(res.bg_ruler, cc.rect(0, 0, 23, 24), cc.rect(5, 5, 10, 10))
	bg.width = width
	bg.height = height
	var start = add / 2 * devide
	var draw = new cc.DrawNode()
	for (var i = 0; i <= max; i++) {
		var label = new cc.LabelBMFont(i.toString(), res.rulerfnt)
		label.setColor(cc.color(0, 0, 0, 255))
		label.setAnchorPoint(0.5, 0.5)
		label.setScale(0.25 * scale)
		label.setPosition(start + fontModify.x, height - labeldix + fontModify.y)
		for (var j = 0; j < 10; j++) {
			var mix = 0
			if (i == max) {
				draw.drawSegment(cc.p(start + j * littlediv, height - updix),
					cc.p(start + j * littlediv, height - labeldix + updix + 8 + mix),
					seg, cc.color(0, 0, 0))
				break
			}
			if (j != 0) {
				mix = 8
			}
			if (j == 5) {
				mix = 6
			}
			draw.drawSegment(cc.p(start + j * littlediv, height - updix),
				cc.p(start + j * littlediv, height - labeldix + updix + 8 + mix),
				seg, cc.color(0, 0, 0))
		}
		start = start + devide
		bg.addChild(label)
	}
	draw.setPosition(lineModify)
	bg.addChild(draw)
	bg.setScale(1 / scale)
	bg.setRotation(rotate)
	return bg
}

function createTubiao(data) {
	data = data || {}
	var Buf = {}
	Buf.xmax = data.xmax || 50
	Buf.ymax = data.ymax || 50
	Buf.xmin = data.xmin || 0
	Buf.ymin = data.ymin || 0
	Buf.segs = data.segs || 50 //拟合曲线每段的线段数 越大精度越高 但消耗也对应提升
	Buf.rootX = Buf.xmin
	Buf.rootY = Buf.ymin
	Buf.xnum = data.xnum || 10
	Buf.ynum = data.ynum || 10
	Buf.xname = data.xname
	Buf.yname = data.yname
	Buf.labelmix = data.labelmix || 35
	Buf.labelmiy = data.labelmiy || 20
	Buf.autoData = data.autoData
	var father = data.father
	if (!father) {
		cc.log("tubiao needs a father to init")
		return null
	}
	Buf.beginx = 0
	Buf.beginy = 0
	Buf.modifyNum = 300
	Buf.endx = 430
	Buf.endy = 350 //坐标
	Buf.mix = 20
	Buf.mixpos = 5
	Buf.hmix = 40
	Buf.zmix = 20
	Buf.netNum = 5
	Buf.radiu = 5
	Buf.xr = false
	Buf.yr = false

	Buf.changeSet = function(data) {
		var Buf = this
		Buf.xmax = data.xmax
		Buf.ymax = data.ymax
		Buf.xmin = data.xmin
		Buf.ymin = data.ymin
	}

	Buf.getPars = function() {
		Buf.xdevide = (Buf.xmax - Buf.xmin) / Buf.xnum
		Buf.ydevide = (Buf.ymax - Buf.ymin) / Buf.ynum

		Buf.begin = cc.p(Buf.beginx, Buf.beginy)
		Buf.end = cc.p(Buf.endx, Buf.endy)
		Buf.misx = -Buf.mixpos
		Buf.misy = -Buf.mixpos
		Buf.anchorX = cc.p(0.5, 1)
		Buf.anchorY = cc.p(1, 0.5)

		if (Buf.xr) {
			Buf.begin.x = Buf.endx + Buf.hmix
			Buf.end.x = Buf.beginx + Buf.hmix
			Buf.misy = Buf.mixpos
			Buf.anchorY = cc.p(0, 0.5)
		}
		if (Buf.yr) {
			Buf.begin.y = Buf.endy + Buf.zmix
			Buf.end.y = Buf.beginy + Buf.zmix
			Buf.misx = Buf.mixpos
			Buf.anchorX = cc.p(0.5, 0)
		}
		Buf.xdis = ((Buf.end.x - Buf.begin.x) + (Buf.xr ? Buf.mix : -Buf.mix)) / Buf.xnum
		Buf.ydis = ((Buf.end.y - Buf.begin.y) + (Buf.yr ? Buf.mix : -Buf.mix)) / Buf.xnum

		Buf.netdisx = Buf.xdis / Buf.netNum
		Buf.netdisy = Buf.ydis / Buf.netNum

		Buf.judgeX = Buf.yr ? -1 : 1
		Buf.judgeY = Buf.xr ? -1 : 1
		var tempWidth = Buf.end.x - Buf.begin.x
		var tempHeight = Buf.end.y - Buf.begin.y
		if (Buf.yr) {
			Buf.xheight = Buf.endy - (Buf.rootY - Buf.ymin) / (Buf.ymax - Buf.ymin) * (Buf.endy - Buf.mix) + Buf.mix
			tempHeight = tempHeight + Buf.mix
		} else {
			Buf.xheight = (Buf.rootY - Buf.ymin) / (Buf.ymax - Buf.ymin) * (Buf.endy - Buf.mix)
			tempHeight = tempHeight - Buf.mix
		}
		if (Buf.xr) {
			Buf.yheight = Buf.endx - (Buf.rootX - Buf.xmin) / (Buf.xmax - Buf.xmin) * (Buf.endx - Buf.mix) + Buf.mix * 2
			tempWidth = tempWidth + Buf.mix
		} else {
			Buf.yheight = (Buf.rootX - Buf.xmin) / (Buf.xmax - Buf.xmin) * (Buf.endx - Buf.mix)
			tempWidth = tempWidth - Buf.mix
		}
		Buf.TouchSize = cc.size(tempWidth, tempHeight)
	}

	var list = [
		"bg_set",
		"btn_1",
		"btn_2",
		"btn_3",
		"btn_4",
		"btn_5",
		"btn_c1",
		"btn_c2",
		"btn_c3",
		"btn_c4",
		"btn_c5",
		"btn_close",
		"btn_sure",
		"btn_cancle",
		"input_1",
		"input_2",
		"input_3",
		"input_4",
		"input_5",
		"input_6",
	]
	var node = loadNode(res.tubiao, list, "bg")
	node.Buf = Buf
	var drawNode = new cc.Node()
	drawNode.setPosition(200, 60)
	node.drawNode = drawNode
	node.addChild(drawNode)
	node.drawNet = function() {
		var node = this
		var Buf = node.Buf
		if (!node.netNode) {
			node.netNode = new cc.DrawNode()
			node.drawNode.addChild(node.netNode)
		}
		var net = node.netNode
		net.clear()
		if (node.showNet) {
			for (var i = 0; i < Buf.xnum; i++) {
				for (var j = 0; j < Buf.netNum; j++) {
					net.drawSegment(cc.p(Buf.begin.x + i * Buf.xdis + j * Buf.netdisx, Buf.begin.y),
						cc.p(Buf.begin.x + i * Buf.xdis + j * Buf.netdisx, Buf.ynum * Buf.ydis + Buf.begin.y),
						1, cc.color(30, 30, 30, 50))
				}
			}
			for (var i = 0; i < Buf.ynum; i++) {
				for (var j = 0; j < Buf.netNum; j++) {
					net.drawSegment(cc.p(Buf.begin.x, Buf.begin.y + i * Buf.ydis + j * Buf.netdisy),
						cc.p(Buf.xnum * Buf.xdis + Buf.begin.x, Buf.begin.y + i * Buf.ydis + j * Buf.netdisy),
						1, cc.color(30, 30, 30, 50))
				}
			}
		}
	}
	node.drawBg = function() {
		var node = this
		var Buf = node.Buf
		Buf.getPars()
		if (!node.bgNode) {
			node.bgNode = new cc.DrawNode()
			node.drawNode.addChild(node.bgNode)
		}
		var draw = node.bgNode
		draw.clear()
		if (node.labelList) {
			for (var i = 0; i < node.labelList.length; i++) {
				node.labelList[i].removeFromParent(true)
			}
		}
		node.labelList = []
		draw.drawSegment(cc.p(Buf.begin.x, Buf.xheight), cc.p(Buf.end.x, Buf.xheight), 1.5, cc.color(0, 0, 0))
		draw.drawSegment(cc.p(Buf.yheight, Buf.begin.y), cc.p(Buf.yheight, Buf.end.y), 1.5, cc.color(0, 0, 0))

		if (Buf.xname) {
			var judge = Buf.xr ? -1 : 1
			var label = new cc.LabelTTF(Buf.xname, null, 16)
			label.setAnchorPoint(0.5, (Buf.yr ? 1 : 0))
			label.setPosition(Buf.end.x + Buf.labelmix * judge, Buf.xheight)
			label.setColor(cc.color(0, 0, 0, 255))
			node.drawNode.addChild(label)
			node.labelList[node.labelList.length] = label
		}
		if (Buf.yname) {
			var judge = Buf.yr ? -1 : 1
			var label = new cc.LabelTTF(Buf.yname, null, 16)
			label.setAnchorPoint((Buf.xr ? 1 : 0), 0.5)
			label.setColor(cc.color(0, 0, 0, 255))
			label.setPosition(Buf.yheight, Buf.end.y + Buf.labelmiy * judge)
			node.drawNode.addChild(label)
			node.labelList[node.labelList.length] = label
		}
		var ver3 = [cc.p(Buf.yheight - Buf.radiu * Buf.judgeX, Buf.end.y),
			cc.p(Buf.yheight + Buf.radiu * Buf.judgeX, Buf.end.y),
			cc.p(Buf.yheight, Buf.end.y + Buf.radiu * 1.2 * Buf.judgeX)
		]
		draw.drawPoly(ver3, cc.color(0, 0, 0, 255), 2, cc.color(0, 0, 0, 255))
		ver3 = [cc.p(Buf.end.x, Buf.xheight - Buf.radiu * Buf.judgeY),
			cc.p(Buf.end.x, Buf.xheight + Buf.radiu * Buf.judgeY),
			cc.p(Buf.end.x + Buf.radiu * 1.2 * Buf.judgeY, Buf.xheight)
		]
		draw.drawPoly(ver3, cc.color(0, 0, 0, 255), 2, cc.color(0, 0, 0, 255))

		for (var i = 0; i <= Buf.xnum; i++) {
			var tempNum = (i * Buf.xdevide + Buf.xmin).toString()
			if (judgeContain(tempNum, ".")) {
				tempNum = (i * Buf.xdevide + Buf.xmin).toFixed(2).toString()
			}
			var label = new cc.LabelBMFont(tempNum, res.rulerfnt)
			label.setColor(cc.color(0, 0, 0))
			label.setScale(0.25)
			label.setAnchorPoint(Buf.anchorX)
			label.setPosition(cc.p(Buf.begin.x + Buf.xdis * i, Buf.begin.y + Buf.misx))
			node.drawNode.addChild(label)
			node.labelList[node.labelList.length] = label
			draw.drawSegment(cc.p(Buf.begin.x + Buf.xdis * i, Buf.begin.y), cc.p(Buf.begin.x + Buf.xdis * i,
				Buf.ynum * Buf.ydis + Buf.begin.y), 0.6, cc.color(30, 30, 30))
		}
		for (var i = 0; i <= Buf.ynum; i++) {
			var tempNum = (i * Buf.ydevide + Buf.ymin).toString()
			if (judgeContain(tempNum, ".")) {
				tempNum = (i * Buf.ydevide + Buf.ymin).toFixed(2).toString()
			}
			var label = new cc.LabelBMFont(tempNum, res.rulerfnt)
			label.setColor(cc.color(255, 0, 0))
			label.setScale(0.25)
			label.setAnchorPoint(Buf.anchorY)
			label.setPosition(cc.p(Buf.begin.x + Buf.misy, Buf.begin.y + Buf.ydis * i))
			node.drawNode.addChild(label)
			node.labelList[node.labelList.length] = label
			draw.drawSegment(cc.p(Buf.begin.x, Buf.begin.y + Buf.ydis * i),
				cc.p(Buf.xnum * Buf.xdis + Buf.begin.x, Buf.begin.y + Buf.ydis * i), 0.6, cc.color(30, 30, 30))
		}
		if (!node.touchLay) {
			node.touchLay = createLayout({
				pos: cc.p(Buf.begin.x + tempx, Buf.begin.y + tempy),
				size: Buf.TouchSize,
				op: 0,
			})
			node.touchLay.setClippingEnabled(true)
			node.drawNode.addChild(node.touchLay)
				// node.touchLay.removeFromParent(true)
				// node.touchLay.removeListen()
				// node.touchLay = null
		}
		var tempx = 0
		var tempy = 0
		if (Buf.TouchSize.width < 0) {
			tempx = Buf.TouchSize.width
			Buf.TouchSize.width = -Buf.TouchSize.width
		}
		if (Buf.TouchSize.height < 0) {
			tempy = Buf.TouchSize.height
			Buf.TouchSize.height = -Buf.TouchSize.height
		}
		node.touchLay.setPosition(cc.p(Buf.begin.x + tempx, Buf.begin.y + tempy))

		if (!node.Free) {
			node.Free = new cc.DrawNode()
			node.touchLay.addChild(node.Free)
		}
		if (!node.autoDraw) {
			node.autoDraw = new cc.DrawNode()
			node.touchLay.addChild(node.autoDraw)
		}
		node.Free.clear()
		node.autoDraw.clear()
		var tempPos = cc.p(0, 0)
		if (Buf.xr) {
			tempPos.x = -Buf.mix - Buf.hmix
		}
		if (Buf.yr) {
			tempPos.y = -Buf.mix - Buf.zmix
		}
		node.Free.setPosition(tempPos)
		node.autoDraw.setPosition(tempPos)
		if (node.touchLay.removeListen) {
			node.touchLay.removeListen()
		}
		createTouchEvent({
			item: node.touchLay,
			end: function(data) {
				var pos = data.pos
				var item = data.item
				var vert = item.convertToNodeSpace(pos)
				var size = item.getContentSize()
				var judge = cc.p(0, 0)
				if (Buf.xr) {
					judge.x = parseFloat((Buf.xmax - vert.x / size.width * (Buf.xmax - Buf.xmin)).toFixed(2))
				} else {
					judge.x = parseFloat((vert.x / size.width * (Buf.xmax - Buf.xmin) + Buf.xmin).toFixed(2))
				}
				if (Buf.yr) {
					judge.y = parseFloat((Buf.ymax - vert.y / size.height * (Buf.ymax - Buf.ymin)).toFixed(2))
				} else {
					judge.y = parseFloat((vert.y / size.height * (Buf.ymax - Buf.ymin) + Buf.ymin).toFixed(2))
				}
				node.drawPoint(judge)
			}
		})

		node.drawNet()
	}
	node.drawItems = function() {
		node.Free.clear()
		node.drawPoints()
		node.drawLinks()
		node.drawRelations()
		node.drawBeziers()
		node.judgeAuto()
	}
	node.showSetting = function() {
		var node = this
		var show = node.showSet ? "scale" : "zoom"
		node.bg_set.stopAllActions()
		addShowType({
			item: node.bg_set,
			show: show,
			time: 0.3,
			fun: function(item) {
				if (node.showSet) {
					addMoving(item)
				} else {
					removeMoving(item)
				}
			}
		})
	}
	node.changeSet = function() {
		var list = [
			"input_1",
			"input_2",
			"input_3",
			"input_4",
			"input_5",
			"input_6",
		]
		for (var i = 0; i < list.length; i++) {
			var input = node[list[i]].input
			var str = parseFloat(input.getString()).toString()
			input.setString(str)
		}
		var tempminx = parseFloat(node[list[0]].input.getString())
		var tempmaxx = parseFloat(node[list[1]].input.getString())
		var tempminy = parseFloat(node[list[2]].input.getString())
		var tempmaxy = parseFloat(node[list[3]].input.getString())
		var tempx = parseFloat(node[list[4]].input.getString())
		var tempy = parseFloat(node[list[5]].input.getString())
		var Buf = node.Buf
		Buf.xmin = getMin([tempminx, tempmaxx, tempx])
		Buf.xmax = getMax([tempminx, tempmaxx, tempx])
		Buf.ymin = getMin([tempminy, tempmaxy, tempy])
		Buf.ymax = getMax([tempminy, tempmaxy, tempy])
		Buf.rootX = tempx
		Buf.rootY = tempy
		node[list[0]].input.setString(Buf.xmin.toString())
		node[list[1]].input.setString(Buf.xmax.toString())
		node[list[2]].input.setString(Buf.ymin.toString())
		node[list[3]].input.setString(Buf.ymax.toString())
		node.drawBg()
		node.drawItems()
	}
	node.getLoop = function(posArray) {
		var zx = 0
		var zxx = 0
		var zxy = 0
		var zy = 0
		for (var i = 0; i < posArray.length; i++) {
			zx += posArray[i].x
			zy += posArray[i].y
			zxx += Math.pow(posArray[i].x, 2)
			zxy += posArray[i].x * posArray[i].y
		}
		var pingx = zx / posArray.length
		var pingy = zy / posArray.length
		var pingxandy = pingx * pingy
		var pingx2 = pingx * pingx
		var b = (zxy - posArray.length * pingxandy) / (zxx - posArray.length * pingx2)
		var a = pingy - b * pingx
		var data = [a, b]
		return data
	}
	node.getLoopLine = function(data) {
		var node = this
		var a = data[1]
		var b = data[0]
		return [cc.p(Buf.xmin, a * Buf.xmin + b), cc.p(Buf.xmax, a * Buf.xmax + b)]
	}
	node.init = function() {
		var node = this
		node.setLocalZOrder(100)
		node.setScale(0)
		node.Links = []
		node.Relation = []
		node.Centon = []
		node.AllRelations = []
		node.AllLinks = []
		node.AllCentons = []
		node.FreePoints = []
		node.bg_set.setScale(0)
		node.bg_set.setLocalZOrder(100)
		node.showNet = false
		node.showSet = false
		node.canDraw = false
		node.auto = false

		node.getAutoSize = function(autoData) {
			var xmin = 0
			var ymin = 0
			var xmax = 0
			var ymax = 0
			var data = autoData
			var change = false
			for (var i = 0; i < data.length; i++) {
				var points = data[i].points
				for (var j = 0; j < points.length; j++) {
					var point = points[j]
					if (point.x < xmin) {
						xmin = point.x
						change = true
					}
					if (point.x > xmax) {
						xmax = point.x
						change = true
					}
					if (point.y < ymin) {
						ymin = point.y
						change = true
					}
					if (point.y > ymax) {
						ymax = point.y
						change = true
					}
				}
			}
			if (xmax == xmin) {
				xmax = xmax + 1
			}
			if (ymax == ymin) {
				ymax = ymax + 1
			}
			if (change) {
				Buf.xmax = xmax
				Buf.xmin = xmin
				Buf.ymax = ymax
				Buf.ymin = ymin
				node.drawBg()
			}
		}

		node.drawAuto = function(data) {
			if (!node.auto) {
				return
			}
			var auto = node.autoDraw
			for (var i = 0; i < data.length; i++) {
				var temp = data[i]
				var colorPoint = temp.colorPoint || cc.color(0, 0, 255, 255)
				var colorLine = temp.colorLine || cc.color(255, 0, 0, 255)
				var colorRleation = temp.colorRleation || cc.color(255, 0, 255, 255)
				var colorCurve = temp.colorCurve || cc.color(0, 255, 255, 255)
				var points = node.order(temp.points)
				for (var j = 0; j < points.length; j++) {
					var pos = points[j]
					auto.drawDot(node.Convert(pos), 2.5, colorPoint)
					if (node.autoLink) {
						if (j != points.length - 1) {
							auto.drawSegment(node.Convert(pos), node.Convert(points[j + 1]), 0.8, colorLine)
						}
					}
				}
				if (points.length > 1 && node.autoRelation) {
					var temp = node.getLoop(points)
					var result = node.getLoopLine(temp)
					auto.drawSegment(node.Convert(result[0]), node.Convert(result[1]), 0.8, colorRleation)
				}
				if (points.length > 1 && node.autoBezier) {
					var beziers = node.getBezier(node.though, points)
					for (var j = 0; j < beziers.length; j++) {
						if (j != 0) {
							node.drawBezier({
								start: beziers[j - 1].end,
								control: beziers[j].control,
								end: beziers[j].end,
								seg: Buf.segs,
								father: auto,
								color: colorCurve,
							})
						} else {
							node.drawBezier({
								start: beziers[j].start,
								control: beziers[j].control,
								end: beziers[j].end,
								seg: Buf.segs,
								father: auto,
								color: colorCurve,
							})
						}
					}
				}
			}
		}

		node.judgeAuto = function() {
			if (node.auto) {
				var autoData = Buf.autoData()
				if (!node.canDraw) {
					node.getAutoSize(autoData)
				}
				node.drawAuto(autoData)
			} else {
				if (node.autoDraw) {
					node.autoDraw.clear()
				}
			}
		}

		node.changeBtn = function(index, vis) {
			var btn = node[sprintf("btn_%d", index)]
			btn.setBright(vis)
			btn.setEnabled(vis)
		}
		node.initBtn = function() {
				for (var i = 1; i <= 5; i++) {
					node.changeBtn(i, false)
				}
			}
			//node.initBtn()
		node.in = function() {
			if (!node.showing) {
				node.showing = true
				node.setPosition(getMiddle())
				node.setLocalZOrder(LOCAL_ORDER++)
				addShowType({
					item: node,
					show: "scale",
					fun: function(item) {
						item.show = true
						item.showing = false
						createTouchEvent({
							item: item,
							begin: function(data) {
								var item = data.item
								item.setLocalZOrder(LOCAL_ORDER++)
								return true
							},
							move: function(data) {
								var item = data.item
								var delta = data.delta
								item.x += delta.x
								item.y += delta.y
							}
						})
					}
				})
			}
		}
		node.out = function() {
			if (!node.showing) {
				node.showing = true
				addShowType({
					item: node,
					show: "zoom",
					fun: function(item) {
						item.show = false
						item.showing = false
						if (item.removeListen) {
							item.removeListen()
						}
					}
				})
			}
		}
		node.btn_close.addClickEventListener(function() {
			if (node.show) {
				node.out()
			}
		})
		var fun_u1 = function() {
			node.drawRelation()
			if (node.auto) {
				node.autoRelation = true
				node.judgeAuto()
			}
		}
		var fun_u2 = function() {
			node.drawLink()
			if (node.auto) {
				node.autoLink = true
				node.judgeAuto()
			}
		}
		var fun_u3 = function() {
			node.getBezier()
			if (node.auto) {
				node.autoBezier = true
				node.judgeAuto()
			}
		}
		var fun_u4 = function() {
			node.Free.clear()
			node.AllCentons = []
			node.AllLinks = []
			node.AllRelations = []
			node.Centon = []
			node.Links = []
			node.Relation = []
			node.FreePoints = []

			//node.initBtn()
			node.auto = false
			node.autoLink = false
			node.autoRelation = false
			node.autoBezier = false
			node.canDraw = false
			node.btn_c1.setSelected(false)
			node.btn_c2.setSelected(false)
			node.changeSet()
			node.drawBg()
			node.drawItems()
		}
		var fun_u5 = function() {
			node.showSet = !node.showSet
			node.showSetting()
		}
		node.btn_1.addClickEventListener(fun_u1)
		node.btn_2.addClickEventListener(fun_u2)
		node.btn_3.addClickEventListener(fun_u3)
		node.btn_4.addClickEventListener(fun_u4)
		node.btn_5.addClickEventListener(fun_u5)
		var fun_1 = function() {
			node.auto = !node.auto
			if (!node.auto) {
				node.changeSet()
			} else {
				node.judgeAuto()
			}
		}
		var fun_2 = function() {
			node.canDraw = !node.canDraw
				// for (var i = 0; i < 5; i++) {
				// 	Things[i]
				// }
				// node.changeBtn(5, node.canDraw)
			if (node.Free) {
				node.Free.setVisible(node.canDraw)
			}
		}
		var fun_3 = function() {
			node.showNet = !node.showNet
			node.drawNet()
		}
		var fun_4 = function() {
			Buf.xr = !Buf.xr
			node.drawBg()
			node.drawItems()
		}
		var fun_5 = function() {
			Buf.yr = !Buf.yr
			node.drawBg()
			node.drawItems()
		}
		var list = [
			["input_1", Buf.xmin],
			["input_2", Buf.xmax],
			["input_3", Buf.ymin],
			["input_4", Buf.ymax],
			["input_5", Buf.xmin],
			["input_6", Buf.ymin],
		]
		for (var i = 0; i < list.length; i++) {
			addInput({
				item: node[list[i][0]],
				str: list[i][1].toString(),
				size: 15,
			})
		}
		var itemlist = [
			["btn_c1", fun_1],
			["btn_c2", fun_2],
			["btn_c3", fun_3],
			["btn_c4", fun_4],
			["btn_c5", fun_5],
		]
		for (var i = 0; i < itemlist.length; i++) {
			node[itemlist[i][0]].addClickEventListener(itemlist[i][1])
			node[itemlist[i][0]].fun = itemlist[i][1]
			createTouchEvent({
				item: node[itemlist[i][0]].getChildByName("label"),
				end: function(data) {
					var item = data.item
					item.getParent().setSelected(!item.getParent().isSelected())
					item.getParent().fun()
				}
			})
		}
		node.btn_cancle.addClickEventListener(function() {
			node.showSet = false
			node.showSetting()
		})
		node.btn_sure.addClickEventListener(function() {
			node.showSet = false
			node.showSetting()
			node.changeSet()
		})
		node.drawBg()
	}
	node.drawPoints = function() {
		var node = this
		if (!node.canDraw) {
			return
		} else {
			for (var i = 0; i < node.FreePoints.length; i++) {
				var pos = node.FreePoints[i]
				node.Free.drawDot(node.Convert(pos), 2.5, cc.color(255, 102, 0, 255))
			}
		}
	}
	node.order = function(list) {
		for (var i = 0; i < list.length; i++) {
			for (var j = i; j < list.length; j++) {
				if (list[i].x > list[j].x) {
					var temp = list[i]
					list[i] = list[j]
					list[j] = temp
				}
			}
		}
		return list
	}
	node.Convert = function(pos) {
		var node = this
		var result = cc.p(0, 0)
		var xDis = Buf.xmax - Buf.xmin
		var yDis = Buf.ymax - Buf.ymin
		var size = node.touchLay.getContentSize()
		if (Buf.xr) {
			result.x = (Buf.xmax - pos.x) / xDis * size.width
		} else {
			result.x = (pos.x - Buf.xmin) / xDis * size.width
		}
		if (Buf.yr) {
			result.y = (Buf.ymax - pos.y) / yDis * size.height
		} else {
			result.y = (pos.y - Buf.ymin) / yDis * size.height
		}
		result.x = parseFloat(result.x.toFixed(2))
		result.y = parseFloat(result.y.toFixed(2))
		result = node.drawNode.convertToNodeSpace(node.touchLay.convertToWorldSpace(result))
		return result
	}
	node.drawPoint = function(pos) {
		var node = this
		if (!node.canDraw) {
			return
		} else {
			node.FreePoints.push(pos)
			node.Free.drawDot(node.Convert(pos), 2.5, cc.color(255, 102, 0, 255))
			if (node.NeedNew) {
				node.Links = []
				node.Relation = []
				node.Centon = []
				node.NeedNew = false
			}
			node.Links.push(pos)
			node.Relation.push(pos)
			node.Centon.push(pos)
		}
	}
	node.drawLink = function() {
		var node = this
		if (!(node.Links.length > 1)) {
			return
		}
		var temp = node.order(node.Links)
		node.AllLinks.push(temp)
		for (var i = 0; i < temp.length - 1; i++) {
			node.Free.drawSegment(node.Convert(temp[i]), node.Convert(temp[i + 1]), 0.8, cc.color(153, 0, 255, 255))
		}
		node.Links = []
		node.NeedNew = true
	}
	node.drawLinks = function() {
		var node = this
		for (var i = 0; i < node.AllLinks.length; i++) {
			var temp = node.AllLinks[i]
			for (var j = 0; j < temp.length - 1; j++) {
				node.Free.drawSegment(node.Convert(temp[j]), node.Convert(temp[j + 1]), 0.8, cc.color(153, 0, 255, 255))
			}
		}
	}
	node.drawBeziers = function() {
		var node = this
		for (var j = 0; j < node.AllCentons.length; j++) {
			var beziers = node.AllCentons[j]
			for (var i = 0; i < beziers.length; i++) {
				if (i != 0) {
					node.drawBezier({
						start: beziers[i - 1].end,
						control: beziers[i].control,
						end: beziers[i].end,
						seg: Buf.segs,
					})
				} else {
					node.drawBezier({
						start: beziers[i].start,
						control: beziers[i].control,
						end: beziers[i].end,
						seg: Buf.segs,
					})
				}
			}
		}
	}
	node.drawBezier = function(data) {
		var start = data.start
		var end = data.end
		var control = data.control
		var node = this
		var seg = data.seg
		var devide = (1 / data.seg)
		var begin = start
		var father = data.father || node.Free
		var color = data.color || cc.color(255, 102, 0, 255)
		var getResult = function(t) {
			var a = (1 - t) * (1 - t)
			var b = 2 * t * (1 - t)
			var c = t * t
			return cc.p(a * start.x + b * control.x + c * end.x, a * start.y + b * control.y + c * end.y)
		}
		for (var i = 0; i <= seg; i++) {
			var temp = getResult(i * devide)
			father.drawSegment(node.Convert(begin), node.Convert(temp), 0.8, color)
			begin = temp
		}
	}
	node.getBezier = function(though, data) {
			var node = this
			var Buf = node.Buf
			var data = data || node.Centon
			if (!(data.length > 1)) {
				return
			}
			var path = node.order(data)
			var beziers = []
			if (path.length == 2) {
				beziers.push({
					start: path[0],
					control: path[0],
					end: path[1],
				})
			} else {
				var start = path[0]
				var end = path[path.length - 1]
				var subtract = function(p1, p2) {
					return cc.p(p1.x - p2.x, p1.y - p2.y)
				}
				var add = function(p1, p2) {
					return cc.p(p1.x + p2.x, p1.y + p2.y)
				}
				var interpolate = function(p1, p2, num) {
					return cc.p(p1.x * num + p2.x * (1 - num), p1.y * num + p2.y * (1 - num))
				}
				if (though) {
					var p = subtract(path[2], path[0])
					p.x /= 4
					p.y /= 4
					var prevBezier = {}
					prevBezier.start = start
					prevBezier.control = subtract(path[1], p)
					prevBezier.end = {}
					beziers.push(prevBezier)
					for (var i = 1; i < path.length - 1; i++) {
						var currentBezier = {}
						currentBezier.start = prevBezier.end
						currentBezier.control = add(path[i], subtract(path[i], prevBezier.control))
						currentBezier.end = {}
						currentBezier.start.x = path[i].x
						currentBezier.start.y = path[i].y
						beziers.push(currentBezier)
						prevBezier = currentBezier
					}
					prevBezier.end = end
				} else {
					var prevBezier = {}
					prevBezier.start = start
					prevBezier.control = cc.p(path[1].x, path[1].y)
					prevBezier.end = {}
					beziers.push(prevBezier)
					for (var i = 1; i < path.length - 2; i++) {
						var currentBezier = {}
						currentBezier.start = prevBezier.end
						currentBezier.control = cc.p(path[i + 1].x, path[i + 1].y)
						currentBezier.end = {}
						var mid = interpolate(prevBezier.control, currentBezier.control, 0.5)
						currentBezier.start.x = mid.x
						currentBezier.start.y = mid.y
						beziers.push(currentBezier)
						prevBezier = currentBezier
					}
					prevBezier.end = end
				}
			}
			for (var i = 0; i < beziers.length; i++) {
				if (i != 0) {
					node.drawBezier({
						start: beziers[i - 1].end,
						control: beziers[i].control,
						end: beziers[i].end,
						seg: Buf.segs,
					})
				} else {
					node.drawBezier({
						start: beziers[i].start,
						control: beziers[i].control,
						end: beziers[i].end,
						seg: Buf.segs,
					})
				}
			}
			if (data == node.Centon) {
				node.Centon = []
				node.AllCentons.push(beziers)
			}
			return beziers
		}
		// //多项式拟合
		// node.getModify = function() {
		// 	var node = this
		// 	if (!(node.Centon.length > 1)) {
		// 		return
		// 	}
		// 	var userInput = node.order(node.Centon)
		// 	var returnResult = []
		// 	var inputMatrix = []
		// 	var n = userInput.length
		// 	for (var i = 0; i < n; i++) {
		// 		var tempArr = [];
		// 		for (var j = 0; j < n; j++) {
		// 			tempArr.push(Math.pow(userInput[i].x, n - j - 1))
		// 		}
		// 		tempArr.push(userInput[i].y)
		// 		inputMatrix.push(tempArr)
		// 	}
		// 	for (var i = 0; i < n; i++) {
		// 		var base = inputMatrix[i][i]
		// 		for (var j = 0; j < n + 1; j++) {
		// 			if (base == 0) {
		// 				//存在相同x不同y的点，无法使用多项式进行拟合
		// 				return false;
		// 			}
		// 			inputMatrix[i][j] = inputMatrix[i][j] / base;
		// 		}
		// 		for (var j = 0; j < n; j++) {
		// 			if (i != j) {
		// 				var baseInner = inputMatrix[j][i]
		// 				for (var k = 0; k < n + 1; k++) {
		// 					inputMatrix[j][k] = inputMatrix[j][k] - baseInner * inputMatrix[i][k];
		// 				}
		// 			}
		// 		}
		// 	}
		// 	for (var i = 0; i < n; i++) {

	// 		if (inputMatrix[i][n] != 0) {
	// 			var tmp_x = 0
	// 			for (var j = 0; j < n - 1 - i; j++) {
	// 				tmp_x = tmp_x + 1
	// 			}
	// 			returnResult.push({
	// 				buf: parseFloat(inputMatrix[i][n]),
	// 				times: tmp_x,
	// 			})
	// 		}
	// 	}
	// 	var pair = {
	// 		begin: userInput[0].x,
	// 		end: userInput[userInput.length - 1].x,
	// 		buf: returnResult,
	// 	}
	// 	node.AllCentons.push(pair)
	// 	node.Centon = []
	// 	node.NeedNew = true
	// 	var vers = node.getCurve(pair)
	// 	var result = []
	// 	for (var i = 0; i < vers.length; i++) {
	// 		result[i] = node.Convert(vers[i])
	// 	}
	// 	for (var i = 0; i < result.length - 1; i++) {
	// 		node.Free.drawSegment(result[i], result[i + 1], 0.8, cc.color(255, 0, 0, 255))
	// 	}
	// }

	// node.countY = function(x, seg) {
	// 	var result = 0
	// 	for (var data in seg) {
	// 		var multi = seg[data].buf
	// 		var times = seg[data].times
	// 		result += (Math.pow(x, times) * multi)
	// 	}
	// 	return result
	// }

	// node.getCurve = function(data) {
	// 	var node = this
	// 	var begin = data.begin
	// 	var end = data.end
	// 	var count = data.buf
	// 	var modifyNum = Buf.modifyNum
	// 	var dis = (end - begin) / modifyNum
	// 	var vertices = []
	// 	for (var i = 0; i <= modifyNum; i++) {
	// 		vertices.push(cc.p(begin + i * dis, node.countY(begin + i * dis, count)))
	// 	}
	// 	return vertices
	// }

	node.drawRelation = function() {
		var node = this
		if (!(node.Relation.length > 1)) {
			return
		}
		var temp = node.getLoop(node.Relation)
		node.AllRelations.push(temp)
		var result = node.getLoopLine(temp)
		node.Free.drawSegment(node.Convert(result[0]), node.Convert(result[1]), 0.8, cc.color(255, 0, 0, 255))
		node.Relation = []
		node.NeedNew = true
	}
	node.drawRelations = function() {
		var node = this
		for (var i = 0; i < node.AllRelations.length; i++) {
			var temp = node.AllRelations[i]
			var result = node.getLoopLine(temp)
			node.Free.drawSegment(node.Convert(result[0]), node.Convert(result[1]), 0.8, cc.color(255, 0, 0, 255))
		}
	}
	node.init()
	father.tubiao = node
	father.addChild(node)
	node.setLocalZOrder(LOCAL_ORDER++)
	return node
}

function createBiaoge(data) {
	var json = data.json
	var inputs = data.inputs || "input%d"
	var downs = data.downs || "down%d"
	var inputNum = data.inputNum || 0
	var finalBg = data.finalBg || "bg_final"
	var finalLabelNmae = data.finalLabelName || "label%d"
	var showType = data.showType || "scale"
	var finalList = data.finalList || []
	var finalLabelNum = data.finalLabelNum || 0
	var rootData = data.rootData || []
	var rootColor = data.rootColor || []
	var noUp = data.noUp || false
	var scale = data.scale || 1
	var inputKeys = data.inputKeys || []
	var downData = data.downData || {}
	var downNums = downData.nums || 0
	var downBufs = downData.bufs || []
	var downKeys = downData.keys || []
	var isShowResult = data.isShowResult || false

	var uilist = [
		"bg_final",
		"btn_close",
		"btn_upload",
		"btn_answer",
		"btn_clear",
		"btn_result",
		"img_result",
		"btn_final_close",
	]

	for (var i = 1; i <= inputNum; i++) {
		uilist.push(sprintf(inputs, i))
	}
	for (var i = 1; i <= downNums; i++) {
		uilist.push(sprintf(downs, i))
	}
	for (var i = 1; i <= finalLabelNum; i++) {
		uilist.push(sprintf(finalLabelNmae, i))
	}
	var biaoge = loadNode(json, uilist, "bg")
	biaoge.setCascadeColorEnabled(true)
	biaoge.setScale(scale)
	biaoge.rootScale = scale
	var down = loadNode(res.biaoge_down, [], "down")
	biaoge.copy = down
	down.retain()

	for (var i = 1; i <= finalLabelNum; i++) {
		if (finalList[i - 1]) {
			biaoge[sprintf(finalLabelNmae, i)].setString(finalList[i - 1])
		}
	}
	if (biaoge.bg_final)
		biaoge.bg_final.rootScale = biaoge.bg_final.getScale()

	biaoge.setPosition(getMiddle())

	var createDown = function(data) {
		var orderCount = 100
		var item = data.item
		var buf = data.buf
		var key = data.key
		var size = item.getContentSize()
		var order = data.order
		var btn_copy = null
		if (!biaoge.copy) {
			return
		} else {
			btn_copy = biaoge.copy.getChildByName("btn_copy")
			btn_copy.setVisible(false)
		}
		item.key = key
		var temp = biaoge.copy.clone()
		var height = temp.height * buf.length
		var normal = temp.getChildByName("normal")
		var select = temp.getChildByName("select")
		var img_correct = temp.getChildByName("img_correct")
		var img_fault = temp.getChildByName("img_fault")
		var normalSize = normal.getContentSize()
		img_correct.setVisible(false)
		img_fault.setVisible(false)
		temp.isOut = false
		temp.width = size.width
		temp.setVisible(true)
		temp.setPosition(size.width / 2, size.height / 2)
		temp.imgPos = cc.p((size.width - normalSize.width) / 2, temp.height / 2)
		normal.setPositionX(size.width)
		select.setPositionX(size.width)
		img_correct.setPositionX(size.width)
		img_fault.setPositionX(size.width)
		temp.normal = normal
		temp.select = select
		temp.img_correct = img_correct
		temp.img_fault = img_fault
		select.setVisible(false)

		temp.setAnswer = function(judge) {
			var temp = this
			temp.img_correct.setVisible(judge)
			temp.img_fault.setVisible(!judge)
		}
		temp.clear = function() {
			temp.img_correct.setVisible(false)
			temp.img_fault.setVisible(false)
			if (temp.img) {
				temp.img.removeFromParent(true)
				temp.img = null
			}
			temp.key = null
		}
		temp.pack = function() {
			var temp = this
			temp.init = true
			temp.show = function() {
				var temp = this
				if (!temp.showing) {
					temp.showing = true
					var lay = temp.lay
					var buf = temp.isOut ? lay.moveDis : cc.p(lay.moveDis.x, -lay.moveDis.y)
					temp.normal.setVisible(temp.isOut)
					temp.select.setVisible(!temp.isOut)
					if (lay) {
						addShowType({
							item: lay,
							show: "moveBy",
							buf: buf,
							time: 0.2,
							fun: function() {
								temp.showing = false
								temp.isOut = !temp.isOut
							}
						})
					}
				}
			}
			temp.back = function() {
				var temp = this
				if (temp.isOut) {
					temp.show()
				}
			}
			temp.set = function(data) {
				var temp = this
				var src = data.src
				var key = data.key
				temp.key = key
				if (temp.img) {
					temp.img.removeFromParent(true)
					temp.img = null
				}
				if (src) {
					temp.img = new cc.Sprite(src)
					temp.img.setPosition(temp.imgPos)
					safeAdd(temp, temp.img)
				}
				temp.show()
			}

			var layDown = createLayout({
				size: cc.size(temp.width, height),
				op: 0,
			})
			layDown.setClippingEnabled(true)
			layDown.setAnchorPoint(0, 1)
			safeAdd(temp, layDown)

			var lay = createLayout({
				size: cc.size(temp.width, height),
				op: 0,
			})
			lay.setPosition(0, height + temp.height)
			temp.lay = lay
			lay.moveDis = cc.p(0, (height + temp.height))
			for (var i = 0; i < buf.length; i++) {
				var t_btn = btn_copy.clone()
				t_btn.width = temp.width
				t_btn.height = temp.height
				t_btn.setVisible(true)
				if (buf[i]) {
					var sp = new cc.Sprite(buf[i])
					sp.setPosition(temp.width / 2, temp.height / 2)
					safeAdd(t_btn, sp)
				}
				t_btn.src = buf[i]
				t_btn.key = i
				t_btn.setPosition(temp.width / 2, height - temp.height / 2 - i * temp.height)
				t_btn.addClickEventListener(function() {
					var btn = this
					temp.set({
						src: btn.src,
						key: btn.key,
					})
				})
				safeAdd(lay, t_btn)
			}
			safeAdd(layDown, lay)
		}
		createTouchEvent({
			item: temp,
			swallow: false,
			begin: function(data) {
				var item = data.item
				var pos = data.pos
				var par = item.getParent()
				if (!item.init) {
					item.pack()
				}
				par.setLocalZOrder(orderCount++)
				safeAdd(par.getParent(), par)
				item.normal.setVisible(temp.isOut)
				item.select.setVisible(!temp.isOut)
				return true
			},
			beginfail: function(data) {
				var item = data.item
				var pos = data.pos
				if (item.back) {
					item.back()
				}
				return false
			},
			end: function(data) {
				var item = data.item
				item.show()
			}
		})
		safeAdd(item, temp)
		item.down = temp
		temp.init = false
		temp.setCascadeColorEnabled(true)
		item.setCascadeColorEnabled(true)
	}

	for (var i = 1; i <= downNums; i++) {
		var item = biaoge[sprintf(downs, i)]
		createDown({
			item: item,
			buf: downBufs[i - 1],
			key: downKeys[i - 1],
		})
	}

	for (var i = 1; i <= inputNum; i++) {
		var font = biaoge[sprintf(inputs, i)]
		addInput({
			item: font,
			backFun: function() {
				if (biaoge.BackFun) {
					biaoge.BackFun()
				}
			},
			color: rootColor[i - 1],
			str: rootData[i - 1],
		})
	}

	if (biaoge.btn_result) {
		biaoge.btn_result.addClickEventListener(function() {
			if (biaoge.img_result) {
				biaoge.img_result.setVisible(!biaoge.img_result.isVisible())
			}
		})
	}
	if (noUp) {
		if (biaoge.btn_upload) {
			biaoge.btn_upload.setVisible(!noUp)
		}
		// var mix = 100
		// if (biaoge.btn_answer) {
		// 	biaoge.btn_answer.setPositionY(biaoge.btn_answer.getPositionY() + mix)
		// }
		// if (biaoge.btn_clear) {
		// 	biaoge.btn_clear.setPositionY(biaoge.btn_clear.getPositionY() + mix / 2)
		// }
	}
	if (biaoge.btn_answer) {
		biaoge.btn_answer.addClickEventListener(function() {
			if (biaoge.bg_final) {
				if (biaoge.bg_final.close) {
					biaoge.bg_final.showIn()
				} else {
					biaoge.bg_final.showOut()
				}
			}
		})
	}

	if (biaoge.btn_final_close) {
		biaoge.btn_final_close.addClickEventListener(function() {
			if (!biaoge.bg_final.close) {
				biaoge.bg_final.showOut()
			}
		})
	}

	if (biaoge.btn_upload) {
		biaoge.btn_upload.addClickEventListener(function() {
			for (var i = 0; i < inputNum; i++) {
				var item = biaoge[sprintf(inputs, i + 1)]
				var result = item.getStr()
				if (result != null && inputKeys[i] != null && result == inputKeys[i]) {
					if (item.setAnswer) {
						item.setAnswer(true)
					}
				} else {
					if (item.setAnswer) {
						item.setAnswer(false)
					}
				}
			}
			for (var i = 0; i < downNums; i++) {
				var item = biaoge[sprintf(downs, i + 1)]
				var down = item.down
				if (item && item.key != null && down.key != null && item.key == down.key) {
					if (down.setAnswer) {
						down.setAnswer(true)
					}
				} else {
					if (down.setAnswer) {
						down.setAnswer(false)
					}
				}
			}
			if (biaoge.upLoadFun) {
				biaoge.upLoadFun()
			}
		})
	}

	if (biaoge.btn_clear) {
		biaoge.btn_clear.addClickEventListener(function() {
			if (biaoge.img_result && !isShowResult) {
				biaoge.img_result.setVisible(false)
			}
			for (var i = 1; i <= inputNum; i++) {
				var temp = biaoge[sprintf(inputs, i)]
				temp.clear(rootData[i - 1])
			}
			for (var i = 1; i <= downNums; i++) {
				var temp = biaoge[sprintf(downs, i)].down
				if (temp) {
					temp.clear()
				}
			}
			if (biaoge.BackFun) {
				biaoge.BackFun()
			}
			if (biaoge.ClearFun) {
				biaoge.ClearFun()
			}
		})
	}

	var showOut = function() {
		var temp = this
		getLoopOp(temp)
		if (!temp.closing) {
			temp.closing = true
			switch (showType) {
				case "scale":
					addShowType({
						item: temp,
						show: "zoom",
						time: 0.3,
						fun: function() {
							temp.closing = false
							if (temp.removeListen) {
								temp.removeListen()
							}
							temp.close = true
						}
					})
					break
				case "fade":
					addShowType({
						item: temp,
						show: "moveBy",
						buf: cc.p(0, 60),
						time: 0.3
					})
					addShowType({
						item: temp,
						show: "fadeOut",
						time: 0.3,
						fun: function() {
							temp.closing = false
							temp.setScale(0)
							if (temp.removeListen) {
								temp.removeListen()
							}
							temp.close = true
						}
					})
					break
			}
		}
	}
	var showIn = function() {
		var temp = this
		setLoopOp(temp)
		if ((temp.close == null || temp.close) && !temp.showing) {
			temp.close = false
			temp.showing = true
			temp.setPosition(getMiddle())
			temp.setLocalZOrder(LOCAL_ORDER++)
			safeAdd(biaoge.getParent(), temp)
			switch (showType) {
				case "fade":
					temp.setPosition(getMiddle(0, -60))
					temp.setScale(temp.rootScale)
					addShowType({
						item: temp,
						show: "moveBy",
						buf: cc.p(0, 60),
						time: 0.3
					})
					addShowType({
						item: temp,
						show: "fadeIn",
						time: 0.3,
						fun: function(item) {
							item.showing = false
							createTouchEvent({
								item: item,
								autoMove: true,
								begin: function(data) {
									var item = data.item
									item.setLocalZOrder(LOCAL_ORDER++)
									return true
								}
							})
						}
					})
					break
				case "scale":
					addShowType({
						item: temp,
						show: "scale",
						time: 0.3,
						scale: temp.rootScale,
						fun: function(item) {
							item.showing = false
							createTouchEvent({
								item: item,
								autoMove: true,
								begin: function(data) {
									var item = data.item
									item.setLocalZOrder(LOCAL_ORDER++)
									return true
								}
							})
						}
					})
					break
			}
		}
	}
	biaoge.showOut = showOut
	biaoge.showIn = showIn
	if (biaoge.bg_final) {
		biaoge.bg_final.showOut = showOut
		biaoge.bg_final.showIn = showIn
	}

	biaoge.show = function() {
		if (biaoge.close) {
			biaoge.showIn()
		} else {
			biaoge.showOut()
		}
	}

	biaoge.getData = function() {
		var result = []
		for (var i = 1; i <= inputNum; i++) {
			var font = biaoge[sprintf(inputs, i)].input.getString()
			result.push(font)
		}
		return result
	}

	biaoge.getKey = function(key) {
		var item = biaoge[sprintf(inputs, key)]
		if (item) {
			return item.input.getString()
		}
	}

	biaoge.setBack = function(fun) {
		biaoge.BackFun = fun
	}
	biaoge.setClear = function(fun) {
		biaoge.ClearFun = fun
	}
	biaoge.setUpLoad = function(fun) {
		biaoge.upLoadFun = fun
	}

	biaoge.btn_close.addClickEventListener(function() {
		biaoge.showOut()
	})
	if (biaoge.img_result && !isShowResult) {
		biaoge.img_result.setVisible(false)
	}
	if (biaoge.bg_final) {
		biaoge.bg_final.setScale(0)
		biaoge.bg_final.rootpos = biaoge.bg_final.getPosition()
		biaoge.bg_final.close = true
	}
	biaoge.close = true
	biaoge.setLocalZOrder(LOCAL_ORDER++)
	return biaoge
}

function createClock() {
	var ui_list = [
		"deco",
		"item_sz",
		"item_sz_red",
		"item_fz",
		"item_fz_red",
		"item_mz",
		"item_mz_red",
		"item_kd",
		"item_kd_red",
	]
	var node = loadNode(res.clock, ui_list, "bg")
	node.redKey = [
		"sz",
		"fz",
		"mz",
		"kd",
	]
	node.redList = [
		"item_sz_red",
		"item_fz_red",
		"item_mz_red",
		"item_kd_red",
	]

	node.setGuideFunc = function(key, buf, fun) {
		if (key && fun) {
			node[sprintf("guideBuf%s", key)] = buf
			node[sprintf("guideFunc%s", key)] = fun
		}
	}

	node.init = function() {
		node.item_sz.rootRotate = node.item_sz.getRotationX()
		node.item_fz.rootRotate = node.item_fz.getRotationX()
		node.item_mz.rootRotate = node.item_mz.getRotationX()
		for (var i = 0; i < node.redList.length; i++) {
			node[node.redList[i]].setVisible(false)
		}
		for (var i = 0; i < node.redKey.length; i++) {
			var temp = node[node.redList[i]]
			temp.myName = node.redKey[i]
			createTouchEvent({
				item: temp,
				begin: function(data) {
					var item = data.item
					if (!node.hasClick) {
						node.hasClick = true
						var fun = node[sprintf("guideFunc%s", item.myName)]
						var buf = node[sprintf("guideBuf%s", item.myName)]
						if (fun) {
							fun(buf)
						}
						return true
					}
					return false
				},
				end: function(data) {
					node.hasClick = false
				}
			})
		}
	}
	node.init()

	node.setTime = function(time) {
		node.changeStatus("stop")
		node.item_sz.setRotation(time / 3600 / 12 * 360 + node.item_sz.rootRotate)
		node.item_fz.setRotation(time % 3600 / 60 / 60 * 360 + node.item_fz.rootRotate)
		node.item_mz.setRotation(time % 60 / 60 * 360 + node.item_mz.rootRotate)
	}
	node.getTime = function(ifStruct) {
		var hour = Math.floor(node.item_sz.getRotationX() % 360 / 360 * 12)
		var mins = Math.floor(node.item_fz.getRotationX() % 360 / 360 * 60)
		var second = node.item_mz.getRotationX() % 360 / 360 * 60
		if (ifStruct) {
			return {
				hour: hour,
				mins: mins,
				second: second,
			}
		} else {
			return hour * 3600 + mins * 60 + second
		}
	}

	node.showRed = function(key) {
		var node = this
		for (var i = 0; i < node.redKey.length; i++) {
			if (key == node.redKey[i]) {
				node[node.redList[i]].setVisible(true)
			} else {
				node[node.redList[i]].setVisible(false)
			}
		}
	}

	node.changeStatus = function(statu) {
		var node = this
		for (var i = 0; i < node.status.length; i++) {
			if (statu == node.status[i][0]) {
				node.statu = statu
				node.status[i][1]()
				return
			}
		}
	}
	node.itemList = [
		"item_sz",
		"item_fz",
		"item_mz",
	]
	node.stopItem = function(key) {
		node[key].stopAllActions()
		node[key].setRotation(node[key].rootRotate)
	}
	node.stop = function() {
		for (var i = 0; i < node.itemList.length; i++) {
			node.stopItem(node.itemList[i])
		}
	}
	node.start = function() {
		addShowType({
			item: node.item_sz,
			show: "circle",
			time: 60 * 60 * 12,
		})
		addShowType({
			item: node.item_fz,
			show: "circle",
			time: 60 * 60,
		})
		addShowType({
			item: node.item_mz,
			show: "circle",
			time: 60,
		})
	}
	node.pause = function() {
		node.item_sz.pause()
		node.item_fz.pause()
		node.item_mz.pause()
	}
	node.resume = function() {
		node.item_sz.resume()
		node.item_fz.resume()
		node.item_mz.resume()
	}
	node.status = [
		["start", node.start],
		["stop", node.stop],
		["pause", node.pause],
		["resume", node.resume],
	]
	node.changeStatus("stop")
	return node
}

function createMatchEll() {
	var draw = new cc.DrawNode()
	var uiList = [
		"btn_a",
		"btn_b",
		"btn_move",
		"btn_print",
		"btn_rotate",
	]
	var node = loadNode(res.match, uiList)
	node.btn_a.addClickEventListener(function() {
		node.curChoose = "A"
	})
	node.btn_b.addClickEventListener(function() {
		node.curChoose = "B"
	})
	node.btn_move.addClickEventListener(function() {
		node.curChoose = "M"
	})
	node.btn_rotate.addClickEventListener(function() {
		node.curChoose = "R"
	})
	node.btn_print.addClickEventListener(function() {
		cc.log("A:", node.a)
		cc.log("B:", node.b)
		cc.log("R:", draw.getRotation())
		cc.log("P:", draw.getPosition())
	})
	draw.setPosition(getMiddle())
	CC_CURRENT_LAYER.addChild(node)
	CC_CURRENT_LAYER.addChild(draw)

	node.curChoose = "A"
	node.a = 100
	node.b = 100
	node.draw = draw

	node.drawEll = function() {
		var node = this
		drawEllipse({
			root: cc.p(0, 0),
			buf: getEllipsePoint({
				a: node.a,
				b: node.b,
				devide: 3,
			}),
			father: node.draw,
		})
	}
	node.drawEll()
	createTouchEvent({
		force: true,
		item: node,
		swallow: false,
		move: function(data) {
			var item = data.item
			var rootPos = data.pos
			var pos = draw.convertToNodeSpace(rootPos)
			switch (item.curChoose) {
				case "A":
					draw.clear()
					item.a = Math.abs(pos.x)
					node.drawEll()
					break
				case "B":
					draw.clear()
					item.b = Math.abs(pos.y)
					node.drawEll()
					break
				case "M":
					draw.setPosition(rootPos)
					break
				case "R":
					draw.setRotation(-getAngle(draw.getPosition(), rootPos))
					break
			}
		}
	})
}

function createTp(data) {
	data = data || {}
	var addFun = data.addFun
	var uiList = [
		"img_ym",
		"img_rotate",
		"img_lm_left",
		"img_lm_right",
		"node_left",
		"node_right",
		"img_tp_left",
		"img_tp_right",
		"img_balance",
	]
	var tp = loadNode(res.nodetp, uiList)
	var pos = data.tppos || cc.p(440, 150)
	var famapos = data.famapos || cc.p(800, 150)
	var father = data.father || CC_CURRENT_LAYER
	var balancepos = data.balancepos || "down"
	tp.setPosition(pos)
	tp.initControl = function() {
		var tp = this
		var s = tp.lmleft.getContentSize()
		createTouchEvent({
			item: tp.lmleft,
			rect: cc.rect(-s.width, -s.height, s.width * 3, s.height * 3), //触发区域九倍
			begin: function(data) {
				var target = data.item
				var pos = data.pos
				var locationInNode = target.convertToNodeSpace(pos)
				var rectdown = cc.rect(-s.width, -s.height, s.width * 3, s.height * 1.5)
				var recttop = cc.rect(-s.width, s.height / 2, s.width * 3, s.height * 1.5)
				if (cc.rectContainsPoint(rectdown, locationInNode)) {
					target.touch = "down"
					if (!target.down) {
						target.down = new cc.Sprite(res.img_arrow)
						target.down.setAnchorPoint(0.5, 0.5)
						target.down.setScale(0.4)
						switch (target.name) {
							case "left":
								target.down.setPosition(5, 0)
								break
							case "right":
								target.down.setPosition(35, 0)
								break
						}
						target.addChild(target.down)
					} else {
						target.down.setVisible(true)
					}
					return true;
				}
				if (cc.rectContainsPoint(recttop, locationInNode)) {
					target.touch = "top"
					if (!target.top) {
						target.top = new cc.Sprite(res.img_arrow)
						target.top.setAnchorPoint(0.5, 0.5)
						target.top.setScale(0.4)
						target.top.setFlippedX(true)
						target.addChild(target.top)
						switch (target.name) {
							case "left":
								target.top.setPosition(5, 30)
								break
							case "right":
								target.top.setPosition(35, 30)
								break
						}
					} else {
						target.top.setVisible(true)
					}
					return true;
				}
				return false
			},
			end: function(data) {
				var target = data.item
				var pos = data.pos
				var count = 1
				if (target.name == "left") {
					if (target.touch == "down") {
						target.down.setVisible(false)
						count = 1
					} else {
						target.top.setVisible(false)
						count = -1
					}
				} else {
					if (target.touch == "down") {
						target.down.setVisible(false)
						count = -1
					} else {
						target.top.setVisible(false)
						count = 1
					}
				}
				tp.moveLm({
					lm: target.name,
					count: count,
				})
				tp.UpdateBalance()
			},
		})
		copyEvent(tp.lmleft, tp.lmright)
		var sizeYm = tp.youma.getContentSize()
		createTouchEvent({
			item: tp.youma,
			rect: cc.rect(-sizeYm.width, -sizeYm.height / 2, sizeYm.width * 3, sizeYm.height * 2),
			move: function(data) {
				var target = data.item
				var delta = data.delta
				if (tp.moveYm(delta.x)) {
					tp.UpdateBalance()
				}
			},
		})

		createTouchEvent({
			item: tp.niezi,
			begin: function(data) {
				var item = data.item
				var pos = data.pos
				if (tp.BALANCE) {
					if (item.isVisible()) {
						item.setVisible(false)
						if (!item.gray) {
							var gray = new cc.Sprite(res.img_niezi_gray)
							gray.setAnchorPoint(0.7, 0.7)
							father.addChild(gray)
							item.gray = gray
						}
						var gray = item.gray
						gray.setPosition(pos)
						gray.setVisible(true)
						return true;
					} else {
						return false
					}
				} else {
					tp.showAlarm(0)
				}
			},
			move: function(data) {
				var item = data.item
				var pos = data.pos
				var delta = data.delta
				item.gray.x += delta.x
				item.gray.y += delta.y
			},
			end: function(data) {
				var item = data.item
				var pos = data.pos
				var finalpos = getAnchor({
					item: item.gray,
					pos: pos,
					anchor: cc.p(0.1, 0.2),
				})
				var target = judgeFama(finalpos)
				if (!target) {
					item.gray.setVisible(false)
					item.setVisible(true)
				} else {
					var weight = target.weight
					switch (target.type) {
						case "in":
							var fama = new cc.Sprite(res[sprintf("img_fama_%d", weight)])
							fama.setPosition(finalpos)
							father.addChild(fama)
							fama.link = target
							target.link = fama
							fama.type = "in"
							fama.weight = weight
							target.setVisible(false)
							item.setVisible(false)
							item.gray.setVisible(false)
							tp.niezijia.setPosition(fama.getContentSize().width / 4, fama.getContentSize().height / 2)
							safeAdd(fama, tp.niezijia)
							break
						case "out":
							target.retain()
							var final = target.getParent().convertToWorldSpace(target.getPosition())
							target.removeFromParent(false)
							father.addChild(target)
							target.setPosition(final)
							target.release()
							tp.niezijia.setPosition(target.getContentSize().width / 4, target.getContentSize().height / 2)
							safeAdd(target, tp.niezijia)
							item.gray.setVisible(false)
							item.setVisible(false)
							tp.addWeight(null, -target.weight)
							tp.followRight[target.key] = null
							tp.UpdateBalance()
							break
					}
				}
			}
		})

		createTouchEvent({
			item: tp.niezijia,
			begin: function(data) {
				var item = data.item
				var pos = data.pos
				if (item.isVisible()) {
					return true
				} else {
					return false
				}
			},
			move: function(data) {
				var item = data.item
				var delta = data.delta
				var par = item.getParent()
				if (par) {
					par.x += delta.x
					par.y += delta.y
				}
			},
			end: function(data) {
				var item = data.item
				var pos = data.pos
				var par = item.getParent()
				pos = par.getPosition()
				var back = function() {
					par.link.setVisible(true)
					tp.niezijia.removeFromParent(false)
					par.removeFromParent(true)
					tp.niezi.setVisible(true)

				}
				var success = function() {
					tp.niezijia.removeFromParent(false)
					tp.niezi.setVisible(true)
				}
				if (judgeIn(tp.tpleft, pos, cc.p(0, 1.2))) {
					tp.showAlarm(1)
					back()
				} else if (judgeIn(tp.tpright, pos, cc.p(0, 1.2))) {
					var target = par.link
					if (!tp.followRight[target.key]) {
						var temp = par
						tp.followRight[target.key] = temp
						temp.retain()
						temp.setPosition(target.rootPos)
						temp.rootPos = target.rootPos
						temp.setLocalZOrder(target.order)
						temp.removeFromParent(false)
						temp.link = target
						temp.key = target.key
						temp.weight = target.weight
						tp.tpright.addChild(temp)
						temp.release()
						tp.addWeight(null, target.weight)
						tp.UpdateBalance()
						success()
					}
				} else {
					back()
				}
			}
		})
		createTouchEvent({
			item: tp.famahe,
			begin: function() {
				if (!tp.BALANCE) {
					tp.showAlarm(0)
				}
			},
		})
	}
	tp.showAlarm = function(index) {
		var dia = res[sprintf("tp_tip%d", index + 1)]
		AddDialog("Tips", {
			res: dia,
			face: 2,
		})
	}
	tp.randomInit = function() {
		//随机初始化天平
		var tp = this
		var max = tp.lmmaxmove / tp.lmpermove
		tp.moveLm({
			lm: "left",
			count: Math.floor(Math.random() * max)
		})
		tp.moveLm({
			lm: "right",
			count: Math.floor(Math.random() * max)
		})
		tp.moveYm(Math.random() * 230)
		tp.UpdateBalance()
	}
	tp.moveYm = function(dis) {
		var tp = this
		var temp = tp.youma.getPositionX() + dis
		if (temp >= tp.youmaMin && temp <= tp.youmaMax) {
			tp.youma.setPositionX(temp)
			tp.addWeight(null, dis * tp.youmaPer)
			return true
		} else if (temp < tp.youmaMin) {
			dis = tp.youmaMin - tp.youma.getPositionX()
			tp.youma.setPositionX(tp.youmaMin)
			tp.addWeight(null, dis * tp.youmaPer)
			return true
		}
	}
	tp.moveLm = function(data) {
		var tp = this
		var lm = data.lm
		var count = data.count
		var par = null
		var item = null
		switch (lm) {
			case "left":
				item = tp.lmleft
				par = 1
				break
			case "right":
				item = tp.lmright
				par = -1
				break
		}
		var temp = item.count + count
		var max = tp.lmmaxmove / tp.lmpermove
		if (temp >= 0 && temp <= max) {
			//可以移动
			item.count = temp
		} else if (temp < 0) {
			count = item.count
			item.count = 0
		} else if (temp > max) {
			count = max - item.count
			item.count = max
		}
		item.x += (count * tp.lmpermove * par)
		if (par == 1) {
			tp.addWeight(null, count * tp.perlm)
		} else {
			tp.addWeight(count * tp.perlm, null)
		}
	}
	tp.UpdateBalance = function() {
		var tp = this
		var dix = tp.weights.right - tp.weights.left
		var par = dix > 0 ? 1 : -1
		var per = 1
		var act = true
		var mix = 0
		var result = {}
		dix = Math.abs(dix)
		if (!(dix >= tp.startRotate)) {
			per = dix / tp.startRotate
		}
		tp.rotate.stopAllActions()
		tp.nodeleft.stopAllActions()
		tp.noderight.stopAllActions()
		var shakes = [{
			per: 0.1,
			time: 0.1
		}, {
			per: -0.1,
			time: 0.1
		}, {
			per: 0.05,
			time: 0.05
		}, {
			per: -0.05,
			time: 0.05
		}, {
			per: 0,
			time: 0.03
		}, ]
		if (tp.rotate.getRotation() == tp.maxRotate * par * per) {
			act = false
		} else {
			mix = (tp.rotate.getRotation() - tp.maxRotate * par * per) / 10
		}

		tp.rotate.current = 0
		tp.nodeleft.current = 0
		tp.noderight.current = 0
		var runloop = function(item, index) {
			var show = (index == 0) ? "rotateTo" : "moveBy"
			var time = shakes[item.current].time
			var buf = null
			switch (index) {
				case 0:
					buf = tp.maxRotate * par * (per + mix * shakes[item.current].per)
					break
				case 1:
					buf = cc.p(0, tp.maxDis * par * (per + mix * shakes[item.current].per) + tp.rooty - item.getPositionY())
					break
				case 2:
					buf = cc.p(0, tp.maxDis * par * -1 * (per + mix * shakes[item.current].per) + tp.rooty - item.getPositionY())
					break
			}
			addShowType({
				item: item,
				show: show,
				time: time,
				buf: buf,
				fun: function(item) {
					item.current++
						if (shakes[item.current]) {
							runloop(item, index)
						} else {
							tp.Updating = false
							if (!tp.BALANCE && tp.youma.getPositionX() <= tp.youmaMin + 0.01) { //允许的误差值
								var mix = Math.abs(tp.weights.left - tp.weights.right)
								if (mix <= 0.03) {
									tp.BALANCE = true
									tp.img_balance.setVisible(true)
								}
							}
						}
				}
			})
		}
		if (act) {
			tp.Updating = true
			runloop(tp.rotate, 0)
			runloop(tp.nodeleft, 1)
			runloop(tp.noderight, 2)
		}
	}
	tp.addWeight = function(left, right) {
		var tp = this
		if (left != null) {
			tp.weights.left += left
		}
		if (right != null) {
			tp.weights.right += right
		}
	}
	tp.addItem = function(data) {
		var tp = this
		tp.tpleft.addItem(data)
		tp.tpright.addItem(data)
	}
	tp.disWeight = function(weight) {
		var tp = this
		tp.addWeight(-weight, null)
		tp.UpdateBalance()
	}
	tp.init = function() {
		var tp = this
		tp.ym = tp.img_ym
		tp.rotate = tp.img_rotate
		tp.lmleft = tp.img_lm_left
		tp.lmright = tp.img_lm_right
		tp.nodeleft = tp.node_left
		tp.noderight = tp.node_right
		tp.tpleft = tp.img_tp_left
		tp.tpright = tp.img_tp_right
		tp.youma = tp.img_ym
		tp.addFun = addFun
		tp.lmleft.count = 0
		tp.lmleft.name = "left"
		tp.lmright.count = 0
		tp.lmright.name = "right"
		tp.maxRotate = 7 //最大旋转角度
		tp.maxDis = 20 //最大垂直位移
		tp.startRotate = 0.5 //开始偏移的差值
		tp.perlm = 0.05 //每次移动螺母造成的重量差
		tp.rooty = tp.node_left.getPositionY()
		tp.lmleftmin = tp.lmleft.getPositionX()
		tp.lmrightmax = tp.lmright.getPositionX()
		tp.youmaMin = tp.youma.getPositionX() //游码最小位置
		tp.youmaMax = tp.youmaMin + 230 //最大位置
		tp.youmaPer = 5 / 230 //每个位置代表质量
		tp.lmmaxmove = 36 //螺母最大偏移
		tp.lmpermove = 3 //螺母每次移动偏移
		tp.img_balance.setVisible(false)
		if (balancepos == "up")
			tp.img_balance.setPosition(25, 380)
		tp.followRight = {}
		tp.followLeft = {}
		tp.weights = {
			left: 0.0,
			right: 0.0,
		}
		var addItem = function(data) {
			var node = this
			var weight = data.weight
			var item = data.item
			var type = data.type || "normal"
			var pos = data.pos
			if (judgeIn(node, pos, cc.p(0, 4.5))) {
				if (!tp.BALANCE) {
					tp.showAlarm(0)
					return
				}
				if (type != node.type) {
					tp.showAlarm(node.alarm)
				} else {
					if (node.type != "fama") {
						if (addFun) {
							addFun({
								item: item,
								pos: pos,
							})
						}
					}
					safeAdd(node, item)
					if (node.type == "fama") {
						tp.addWeight(null, weight)
					} else {
						tp.addWeight(weight, null)
					}
					tp.UpdateBalance()
				}
			}
		}
		tp.tpleft.addItem = addItem
		tp.tpleft.type = "normal"
		tp.tpleft.alarm = 1
		tp.tpright.addItem = addItem
		tp.tpright.type = "fama"
		tp.tpright.alarm = 2
		tp.initControl()
		tp.randomInit()
	}
	var famalist = [
		"img_5g",
		"img_10g",
		"img_20g_1",
		"img_20g_2",
		"img_50g",
		"img_100g",
	]
	tp.famalist = famalist
	famalist.push("img_nz")
	var fama = loadNode(res.nodefm, famalist, "bg")
	tp.niezi = fama.img_nz
	tp.niezijia = new cc.Sprite(res.img_niezi_jia)
	tp.niezijia.retain()
	tp.famahe = fama
	tp.niezijia.setAnchorPoint(0, 0)
	tp.famalist = [{
		weight: 5,
		item: fama.img_5g,
		key: "5g",
		root: cc.p(80, 30),
		order: 6
	}, {
		weight: 10,
		item: fama.img_10g,
		key: "10g",
		root: cc.p(110, 40),
		order: 5
	}, {
		weight: 20,
		item: fama.img_20g_1,
		key: "20g1",
		root: cc.p(140, 50),
		order: 4
	}, {
		weight: 20,
		item: fama.img_20g_2,
		key: "20g2",
		root: cc.p(60, 50),
		order: 3
	}, {
		weight: 50,
		item: fama.img_50g,
		key: "50g",
		root: cc.p(90, 60),
		order: 2
	}, {
		weight: 100,
		item: fama.img_100g,
		key: "100g",
		root: cc.p(120, 70),
		order: 1
	}, ]
	fama.setPosition(famapos)
	var judgeFama = function(pos) {
		for (var i = 0; i < tp.famalist.length; i++) {
			var item = tp.famalist[i]
			item.item.weight = item.weight
			item.item.key = item.key
			item.item.rootPos = item.root
			item.item.order = item.order
			var target = item.item
			target.type = "in"
			var s = target.getContentSize()
			var local = target.convertToNodeSpace(pos)
			var rect = cc.rect(-s.width * 0.1, -s.height * 0.1, s.width * 1.2, s.height * 1.2)
			if (target.isVisible() && cc.rectContainsPoint(rect, local)) {
				return target
			}
		}
		for (var key in tp.followRight) {
			var item = tp.followRight[key]
			if (item) {
				var s = item.getContentSize()
				var local = item.convertToNodeSpace(pos)
				var rect = cc.rect(0, 0, s.width, s.height)
				item.type = "out"
				if (cc.rectContainsPoint(rect, local)) {
					return item
				}
			}
		}
	}
	tp.BALANCE = false
	tp.init()
	father.addChild(fama)
	father.addChild(tp)

	//天平用例 拷贝到任意界面即可
	// var tp = createTp({
	//            father: self,
	//            addFun: function(data) {
	//                var item = data.item
	//                item.setPosition(0, 0)
	//                item.inTp = true
	//            },
	//        })
	//        var item = new cc.Sprite(res.img_exp1)
	//        item.setPosition(getMiddle())
	//        createTouchEvent({
	//            item: item,
	//            begin:function(data){
	//                var item = data.item
	//                var pos = data.pos
	//                if(item.inTp){
	//                    cc.log("fuck me !11")
	//                    item.inTp = false
	//                    tp.disWeight(10)
	//                    item.setPosition(pos)
	//                    safeAdd(self, item)
	//                }
	//                return true
	//            },
	//            move: function(data) {
	//                var item = data.item
	//                var delta = data.delta
	//                item.x += delta.x
	//                item.y += delta.y
	//            },
	//            end: function(data) {
	//                data.weight = 10
	//                tp.addItem(data)
	//            }
	//        })
	//        safeAdd(self, item)
	return tp
}

function createJJD(data) {
	loadPlist("hcfire")
	loadPlist("dgtq")
	loadPlist("jjhy")
	data = data || {}
	var pos = data.pos || getMiddle()
	var father = data.father
	var fun = data.fun
	var scale = data.scale || 1
	var jjd = new cc.Sprite(res.img_jjd)
	var sp = jjd
	jjd.setScale(scale)
	var dg = new ccui.ImageView(res.img_dg)
	var size = sp.getContentSize()
	dg.setPosition(size.width * 0.52, size.height * 0.85)
	dg.rootPos = cc.p(size.width * 0.52, size.height * 0.85)
	sp.addChild(dg)
	var dataControl = {}
	dg.state = "DOWN"
	var TAG_HC = 520
	var TAG_JJHY = 521
	var anihcfire = function() {
		return cc.repeatForever(createAnimation({
			frame: "hcfire%02d.png",
			end: 10
		}))
	}
	var anijjhy = function() {
		return cc.repeatForever(createAnimation({
			frame: "jjhy%02d.png",
			end: 10
		}))
	}
	var anidgtq = function(fun, rever) {
		return cc.sequence(createAnimation({
			frame: "dgtq%02d.png",
			end: 13,
			time: 0.05,
			rever: rever,
		}), cc.callFunc(function() {
			if (fun) {
				fun()
			}
		}))
	}

	jjd.canClick = true

	jjd.setCanClick = function(judge){
		jjd.canClick = judge
	}

	jjd.setCallBack = function(data){
		var up = data.up
		var down = data.down
		var fire = data.fire
		var cutFire = data.cutFire
		jjd.upFunc = up
		jjd.downFunc = down
		jjd.fireFunc = fire
		jjd.cutFireFunc = cutFire
	}

	jjd.exeDown = function(){
		    var target = dg
			var node = new cc.Sprite()
			node.setAnchorPoint(0, 0)
			node.setPositionX(-6)
			target.setOpacity(0)
		   if(target.state == "UP"){
			   	dataControl.dianran = false
				if (sp.getChildByTag(TAG_HC)) {
					sp.removeChildByTag(TAG_HC)
				}
				if (sp.getChildByTag(TAG_JJHY)) {
					sp.removeChildByTag(TAG_JJHY)
				}
				target.setPosition(target.rootPos)
				node.runAction(anidgtq(function() {
					node.removeFromParent(true)
					target.setOpacity(255)
					target.state = "DOWN"
				}, true))
				target.addChild(node)
				if(jjd.downFunc){
					jjd.downFunc()
				}
				if(jjd.isFire){
					if(jjd.cutFireFunc){
						jjd.cutFireFunc()
					}
				}
				jjd.isFire = false
		   }
	}

	createTouchEvent({
		item: dg,
		begin: function(data) {
			if(!jjd.canClick){
				return false
			}
			var target = data.item
			var node = new cc.Sprite()
			node.setAnchorPoint(0, 0)
			node.setPositionX(-6)
			target.setOpacity(0)
			switch (target.state) {
				case "DOWN":
					node.runAction(anidgtq(function() {
						node.removeFromParent(true)
						target.setOpacity(255)
						target.setPosition(200, 50)
						target.state = "UP"
						var hc = new ccui.ImageView(res.img_hc)
						hc.setPosition(200, 145)
						var tnode = new cc.Sprite()
						tnode.runAction(anihcfire())
						tnode.setPosition(8, 19)
						hc.setTag(TAG_HC)
						hc.addChild(tnode)
						sp.addChild(hc)
						jjd.isFire = false
						createTouchEvent({
							item: hc,
							begin: function(data) {
								var target = data.item
								addShowType({
									item: target,
									show: "moveTo",
									time: 0.6,
									fun: function(item) {
										var tfire = new cc.Sprite()
										tfire.runAction(anijjhy())
										tfire.setTag(TAG_JJHY)
										dataControl.fire = tfire
										tfire.setPosition(65, 150)
										dataControl.dianran = true
										sp.addChild(tfire)
										if(jjd.fireFunc){
											jjd.fireFunc()
										}
										item.removeFromParent(true)
										if (fun) {
											fun()
										}
										jjd.isFire = true
									},
									buf: cc.p(95, 145)
								})
								return true
							}
						})
					}))
					target.addChild(node)
					if(jjd.upFunc){
						jjd.upFunc()
					}
					break
				case "UP":
					dataControl.dianran = false
					if (sp.getChildByTag(TAG_HC)) {
						sp.removeChildByTag(TAG_HC)
					}
					if (sp.getChildByTag(TAG_JJHY)) {
						sp.removeChildByTag(TAG_JJHY)
					}
					target.setPosition(target.rootPos)
					node.runAction(anidgtq(function() {
						node.removeFromParent(true)
						target.setOpacity(255)
						target.state = "DOWN"
					}, true))
					target.addChild(node)
					if(jjd.downFunc){
						jjd.downFunc()
					}
					if(jjd.isFire){
						if(jjd.cutFireFunc){
							jjd.cutFireFunc()
						}
					}
					jjd.isFire = false
					break
			}

		}
	})
	if (father) {
		father.addChild(jjd)
	}
	if (pos) {
		jjd.setPosition(pos)
	}
	jjd.getFirePos = function() {
		if (dataControl.dianran) {
			var fire = dataControl.fire
			var size = fire.getContentSize()
			var pos = cc.p(size.width / 2, size.height)
			pos = fire.convertToWorldSpace(pos)
			return pos
		}
		return null
	}
	return jjd
}

function createHand(data) {
	data = data || {}
	var item = data.item
	var uiList = [
		"item",
		"back",
		"front",
	]
	var hand = loadNode(res.hand, uiList, "bg")
	if (item) {
		safeAdd(hand.item, item)
	}
	return hand
}

function createSmell(data) {
	var pos = data.pos || getMiddle()
	var fun = data.fun
	var repeat = data.repeat || 6
	var saykey = data.saykey || repeat
	var father = data.father
	var key = data.key || "cj"
	var delay = data.delay || 1.5
	var scale = data.scale || 1
	var keyList = [
		["cj", 1],
		["sz", 2],
	]
	for (var i = 0; i < keyList.length; i++) {
		if (keyList[i][0] == key) {
			key = keyList[i][1]
			break
		}
	}
	var uiList = [
		"hand",
		"font",
		"back",
		"btn_close",
	]

	var man = loadNode(res.smell, uiList, "bg")
	man.act = function() {
		var man = this
		var buf = man.show ? "zoom" : "scale"
		addShowType({
			item: man.back,
			show: buf,
			time: 0.3,
			fun: function() {
				man.show = !man.show
			}
		})
	}
	man.dis = function(judge) {
		judge = judge || false
		var man = this
		man.stopAllActions()
		addShowType({
			item: man,
			show: "fadeOut",
			time: 0.3,
			fun: function(item) {
				item.removeFromParent(!judge)
			}
		})
	}
	man.init = function() {
		var man = this
		man.back.setScale(0)
		man.show = false
		man.setPosition(pos)
		man.setScale(scale)
		if (father) {
			safeAdd(father, man)
		}
		var ani = cc.sequence(cc.repeat(createAnimation({
			frame: "img_smell_%02d.png",
			start: 1,
			end: 8,
			time: 0.05,
		}), repeat), cc.callFunc(function() {
			man.act()
			if (fun) {
				fun()
			}
		}), cc.delayTime(delay), cc.callFunc(function() {
			man.dis()
		}))
		man.btn_close.addClickEventListener(function() {
			man.dis()
		})
		man.hand.runAction(ani)
		man.font.setSpriteFrame(sprintf("img_smell_font%d.png", key))
	}
	man.init()
	return man
}