//author mu @16/4/20

var timerControl = {
		timerNode: null,
		timerData: {},
	} //添加在场景上 场景切换上个场景的计时器全部删除 由于目前是图层切换 只在加载的时候有场景切换 暂时不做改动

timerControl.addTimer = function(data) {
	//cc.log(data)
	var fun = data.fun
	var delay = data.delay || 0
	var time = data.time || 0.1
	var repeat = data.repeat || 1
	var key = data.key || getRandKey()
	var type = data.type || "action"
	var finish = data.finish
	var after = data.after
	var buf = data.buf

	var father = data.father
	if (!father) {
		if (!this.timerNode) {
			this.timerNode = new cc.Node()
			this.timerNode.retain()
			cc.director.getRunningScene().addChild(this.timerNode)
		} else {
			var scene = this.timerNode.getParent()
			var curscene = cc.director.getRunningScene()
			if (!(scene && scene == curscene)) {
				this.timerNode = null
				return this.addTimer(data)
			}
		}
	}
	cc.log("addTimer", key)

	var node = null
	switch (type) {
		case "normal":
			node = new cc.Node()
			node.finish = finish
			node.schedule(fun, time, repeat, delay)
			node.myType = type
			break
		case "action":
			if(repeat == cc.REPEAT_FOREVER){
				repeat = cc.REPEAT_FOREVER / 2
			}
			node = new cc.Node()
			node.finish = finish
			node.runAction(
				cc.sequence(
					cc.delayTime(delay),
					cc.repeat(
						cc.sequence(
							cc.delayTime(time),
							cc.callFunc(function() {
								if (fun) {
									fun(buf)
								}
							})), repeat),
					cc.callFunc(function(){
						if(after){
							after()
						}
					})
					)
				)
			node.myType = type
			break
	}



	if (!this.timerData) {
		this.timerData = {}
	}

	removeTimer(key)
	if (father) {
		father.addChild(node)
	} else {
		this.timerNode.addChild(node)
	}
	this.timerData[key] = node
	node.setName(key)
	return node
}

timerControl.removeTimer = function(key) {
	var node = this.timerData[key]
	if (node) {
		switch (node.myType) {
			case "normal":
				node.unschedule()
				break
			case "action":
				node.stopAllActions()
				break
		}
		node.removeFromParent(true)
		this.timerData[key] = null
		cc.log("removeTimer:", key)
	}
}

timerControl.finishTimer = function(key){
	var node = this.timerData[key]
	if(node){
		if(node.finish){
			node.finish()
		}
		removeTimer(key)
	}
}

timerControl.printTimer = function() {
	cc.log("node", this.timerNode)
	if (this.timerNode) {
		var children = this.timerNode.getChildren()
		for (var i = 0; i < children.length; i++) {
			cc.log("Name:", children[i].getName())
		}
	}
}

timerControl.clearTimer = function() {
	if (this.timerNode) {
		if (this.timerNode.getParent) {
			this.timerNode.release()
			this.timerNode.removeFromParent(true)
		}
	}
	this.timerNode = null
}

clearTimer = timerControl.clearTimer
addTimer = timerControl.addTimer
removeTimer = timerControl.removeTimer
printTimer = timerControl.printTimer
finishTimer = timerControl.finishTimer
	/*
	//author mu @16/4/20

	var timerControl = {
		timerNode:null,
	}//添加在场景上 场景切换上个场景的计时器全部删除 由于目前是图层切换 只在加载的时候有场景切换 暂时不做改动
	//计时器重构

	timerControl.addTimer = function(data)
	{
		var fun 	= data.fun
		var delay 	= data.delay || 0
		var time 	= data.time || 0.1
		var repeat 	= data.repeat || 1
		var key 	= data.key
		var self = this
		if(!self.timerNode){
			self.timerNode = []
		}
		var node = null
		node = setTimeout(function(){
			var temp = null
			temp = setInterval(update(key, fun), time)
			self.timerNode[key] = temp
			temp.allCount = repeat
			temp.key = key
			clearTimeout(node)
		}, delay)
	}

	timerControl.update = function(key, fun){
		if(fun){
			fun()
		}
		var self = this
		var item = self.timerNode[key]
		if(!item.repeatCount){
			item.repeatCount = 0
		}
		item.repeatCount ++
		if(item.repeatCount == item.allCount){
			removeTimer(item.key)
		}
	}

	timerControl.removeTimer = function(key)
	{
		var self = this
		var temp = self.timerNode[key]
		if(temp){
			clearInterval(temp)
			temp = null
		}
	}

	update = timerControl.update
	addTimer 	= timerControl.addTimer
	removeTimer = timerControl.removeTimer
	*/