var res = {
    mainLayer: "res/mainLayer.json",
    expLayer: "res/expLayer.json",
    learnLayer: "res/learnLayer.json",
    helpLayer: "res/helpLayer.json",
    exitNode: "res/exitNode.json",
    quitExp: "res/otherExitNode.json",
    seeExp: "res/seeExpLayer.json",
    showLayer: "res/showLayer.json",
    showScore: "res/showScore.json",
    showsuccess: "res/showsuccess.json",
    startgo: "res/startgo.json",
    tips: "res/nodeTips.json",
    nums: "res/fnt/nums.fnt",
    myttf: "res/fnt/myttf.TTF",
    hudie: "res/hudie.json",
    listNum: "res/fnt/listNums.fnt",
    biaoge_down: "res/bg_down.json",
}

var itemsJson = {
    tubiao: {
        tubiao: "res/Tubiao.json",
        rulerfnt: "res/img/ruler/ruler.fnt",
    },
    clock: {
        clock: "res/clock.json",
    },
    match: {
        match: "res/matchEll.json",
    },
    ruler: {
        rulerfnt: "res/img/ruler/ruler.fnt",
    },
    counter: {
        counter: "res/counter.json",
        counterfnt: "res/img/jsq/counter.fnt",
    },
    watch: {
        watch: "res/watch.json",
    },
    car: {
        car: "res/car.json",
    },
    tp: {
        nodetp: "res/nodetp.json",
        nodefm: "res/nodefama.json",
    },
    hand: {
        hand: "res/hand.json",
    },
    smell: {
        smell: "res/smell.json",
    }
}

function getRes(list, name) {
    if (list[name]) {
        var data = list[name]
        for (index in data) {
            var temp = data[index]
            if(NEEDCHANGEPATH){
                temp.Src = temp.Src.replace("res", RESKEY)
            }
            switch (temp.Type) {
                case "img":
                    res[index] = temp.Src + ".png" //以后可能会出现多个实验图片名冲突 在这里改
                    break
                case "plist":
                    res[index] = temp.Src + ".plist"
                    res[index + 'img'] = temp.Src + ".png"
                    break
                case "mp3":
                    res[index] = temp.Src + ".mp3"
                    break
                case "mp4":
                    res[index] = temp.Src + ".mp4"
                    break
                case "jpg":
                    res[index] = temp.Src + ".jpg"
                    break
                case "ogg":
                    res[index] = temp.Src + ".ogg"
                    break
                case "content":
                    res[index] = temp.Src + ".png"
                    res[index + '_sound'] = temp.Src + ".mp3"
                    break
                case "tool":
                    res[index + "_normal"] = temp.Src + "_normal.png"
                    res[index + '_gray'] = temp.Src + "_gray.png"
                    break
                case "json":
                    res[index] = temp.Src + ".json"
                    break
            }
        }
    } else {
        cc.log("no this exp name", name)
    }
}

var judge = function(str, match) {
    var len = str.length
    var lenMatch = match.length
    for (var i = len - lenMatch, j = 0; j < lenMatch; j++, i++) {
        if (str[i] != match[j]) {
            return false
        }
    }
    return true
}

var ResList = [
    "Common",
]


for (var i = 0; i < ResList.length; i++) {
    getRes(commonJs, ResList[i])
}