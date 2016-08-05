//all common funcs codes here
var changeTime = 0.3
var func = {
      myInit: false,
}
var keyGen = 1
var CAN_BACK = true
      //实验相关
func.scaleMove = function(data) {
      var item = data.item
      var delta = data.delta
      var xmin = data.xmin
      var xmax = data.xmax
      var ymin = data.ymin
      var ymax = data.ymax
      var loopscale = getLoopScale(item)
      if (xmin != null || xmax != null || ymin != null || ymax != null) {
            var tempx = item.x + (delta.x / loopscale)
            var tempy = item.y + (delta.y / loopscale)
            if (xmin != null) {
                  if (tempx < xmin) {
                        tempx = xmin
                  }
            }
            if (ymin != null) {
                  if (tempy < ymin) {
                        tempy = ymin
                  }
            }
            if (xmax != null) {
                  if (tempx > xmax) {
                        tempx = xmax
                  }
            }
            if (ymax != null) {
                  if (tempy > ymax) {
                        tempy = ymax
                  }
            }
            item.x = tempx
            item.y = tempy
      } else {
            item.x += (delta.x / loopscale)
            item.y += (delta.y / loopscale)
      }
}
scaleMove = func.scaleMove

func.judgeList = function(data) {
      var src = data.src
      var dest = data.dest
      var nums = data.nums
      if (src == null) {
            src = []
            for (var i = 0; i < nums; i++) {
                  src[i] = dest
            }
      } else {
            if (src[0] == null) {
                  var temp = []
                  for (var i = 0; i < nums; i++) {
                        temp[i] = src
                  }
                  src = temp
            }
      }
      return src
}

judgeList = func.judgeList

func.createJudgeBtn = function(data) {
      var normal = data.normal
      var select = data.select
      var act = data.act
      var fun = data.fun
      var back = data.back
      var pos = data.pos || getMiddle()
      var father = data.father
      var sp = null
      var frame = data.frame || false
      if (frame) {
            sp = new cc.Sprite(sprintf("#%s", normal))
      } else {
            sp = new ccui.ImageView(normal)
      }
      createTouchEvent({
            item: sp,
            begin: function(data) {
                  var item = data.item
                  if (act) {
                        if (frame) {
                              item.setSpriteFrame(act)
                        } else {
                              item.loadTexture(act)
                        }
                  }
                  return true
            },
            end: function(data) {
                  var item = data.item
                  if (item.acting) {
                        if (fun) {
                              fun(item)
                        }
                        if (frame) {
                              item.setSpriteFrame(select)
                        } else {
                              item.loadTexture(select)
                        }
                  } else {
                        if (back) {
                              back(item)
                        }
                        if (frame) {
                              item.setSpriteFrame(normal)
                        } else {
                              item.loadTexture(normal)
                        }
                  }
                  item.acting = !item.acting
            }
      })
      sp.change = function(ifact, iffun) {
            var sp = this
            if (ifact) {
                  if (frame) {
                        sp.setSpriteFrame(select)
                  } else {
                        sp.loadTexture(select)
                  }
                  if (iffun) {
                        if (fun) {
                              fun(sp)
                        }
                  }
            } else {
                  if (frame) {
                        sp.setSpriteFrame(normal)
                  } else {
                        sp.loadTexture(normal)
                  }
                  if (iffun) {
                        if (back) {
                              back(sp)
                        }
                  }
            }
            sp.acting = !ifact
      }
      sp.setPosition(pos)
      sp.acting = true
      if (father) {
            safeAdd(father, sp)
      }
      return sp
}

createJudgeBtn = func.createJudgeBtn

func.setOff = function(item, off) {
      if (item.setPosition) {
            var temp = item.getPosition()
            temp = cc.p(temp.x + off.x, temp.y + off.y)
            item.setPosition(temp)
      }
}
setOff = func.setOff

func.initBg = function(data) {
      var item = data.item
      var move = data.move
      var init = data.init || false
      item.act = function() {
            var item = this
            var judge = !item.isOut
            var result = judge ? "scale" : "zoom"
            if (!item.showing) {
                  item.showing = true
                  item.isOut = !item.isOut
                  addShowType({
                        item: item,
                        show: result,
                        time: 0.3,
                        fun: function(item) {
                              item.showing = false
                              if (item.isOut) {
                                    addMoving(item)
                              } else {
                                    removeMoving(item)
                              }
                        }
                  })
            }
      }
      item.in = item.act
      item.out = item.act
      item.showing = false
      item.isOut = init
      item.setScale(init ? 1 : 0)
}
initBg = func.initBg

func.safeAdd = function(father, child) {
      if (child.getParent()) {
            child.retain()
            child.removeFromParent(false)
            father.addChild(child)
            child.release()
      } else {
            father.addChild(child)
      }
}

safeAdd = func.safeAdd

func.listOrder = function(list, judge) {
      for (var i = 0; i < list.length; i++) {
            for (var j = i; j < list.length; j++) {
                  if (judge) {
                        if (list[i] < list[j]) {
                              var temp = list[i]
                              list[i] = list[j]
                              list[j] = temp
                        }
                  } else {
                        if (list[i] > list[j]) {
                              var temp = list[i]
                              list[i] = list[j]
                              list[j] = temp
                        }
                  }
            }
      }
      return list
}

listOrder = func.listOrder

func.judgeInside = function(data) {
      var item = data.item
      var pos = data.pos
      var mix = data.mix || cc.p(1, 1) //倍数
      var off = data.off || cc.p(0, 0) //偏移
      var target = item
      var locationInNode = target.convertToNodeSpace(pos)
      var size = item.getContentSize()
      var width = size.width * mix.x
      var height = size.height * mix.y
      var startx = size.width / 2 - width / 2 + size.width * off.x
      var starty = size.height / 2 - height / 2 + size.height * off.y
      var s = target.getContentSize()
      var inrect = cc.rect(startx, starty, width, height)
      if (cc.rectContainsPoint(inrect, locationInNode)) {
            return true
      }
      return false
}

judgeInside = func.judgeInside

func.getBackPos = function(data) {
      var item = data.item
      var pos = data.pos
      pos = item.convertToNodeSpace(pos)
      var size = item.getContentSize()
      var delta = cc.p(0, 0)
      if (pos.x < 0) {
            delta.x = -pos.x
      }
      if (pos.x > size.width) {
            delta.x = -(pos.x - size.width)
      }
      if (pos.y < 0) {
            delta.y = -pos.y
      }
      if (pos.y > size.height) {
            delta.y = -(pos.y - size.height)
      }
      return delta
}

getBackPos = func.getBackPos

func.createMoveRotate = function(data) {
      var lay = data.item

      var mix = data.mix || 20
      var sel = data.sel || 140 //选择的方向大小
      var tri = data.tri || 90 //移动的方向大小
      var dis = 360 - tri * 2 - sel
      var judgeTime = data.judgeTime || 0.2
      var aim = data.aim

      lay.judgeList = [{
            name: "up",
            buf: [90 - dis / 2 + aim, 90 + dis / 2 + aim],
      }, {
            name: "left",
            buf: [90 + dis / 2 + aim, 90 + dis / 2 + tri + aim],
      }, {
            name: "down",
            buf: [90 + dis / 2 + tri + aim, 90 + dis / 2 + tri + sel + aim],
      }, {
            name: "right",
            buf: [90 + dis / 2 + tri + sel + aim, 90 + dis / 2 + tri + sel + 90 + aim],
      }, ]
      for (var i = 0; i < lay.judgeList.length; i++) {
            var buf = lay.judgeList[i].buf
            for (var j = 0; j < buf.length; j++) {
                  if (buf[j] > 360) {
                        buf[j] -= 360
                  }
                  if (buf[j] < 0) {
                        buf[j] += 360
                  }
            }
      }

      lay.listenRotate = function(pos) {
            var item = this
            item.startPos = pos
            item.judge = false
            item.tri = null
            item.select = null
            item.stopAllActions()
            item.runAction(cc.sequence(
                  cc.delayTime(judgeTime),
                  cc.callFunc(function() {
                        item.judge = true
                  })))
      }

      lay.getAngle = function(pos) {
            var lay = this
            var angle = getAngle(lay.startPos, pos)
            for (var i = 0; i < lay.judgeList.length; i++) {
                  var buf = lay.judgeList[i]
                  var name = buf.name
                  var data = buf.buf
                  if (data[0] < data[1]) {
                        if (angle >= data[0] && angle < data[1]) {
                              return name
                        }
                  } else {
                        if ((angle >= 0 && angle <= data[1]) || (angle >= data[0] && angle <= 360)) {
                              return name
                        }
                  }
            }
            return null
      }

      lay.getDis = function(pos) {
            var item = this
            return getDis(item.startPos, pos)
      }

}
createMoveRotate = func.createMoveRotate

func.createList = function(data) {
      data = data || {}
      var type = data.type || "S"
      var color = data.color || "blue"
      var arrow = data.arrow || "blue"
      var num = data.num || 4
      var size = data.size || cc.size(170, 700)
      var pos = data.pos || getMiddle()
      var scale = data.scale || 1
      var list = data.list || []
      var offset = data.offset || cc.p(0, 0)
      var modify = data.modify || cc.p(0, 0)
      var ifPage = data.ifPage || false
      var pageOff = data.pageOff || cc.p(size.width * 0.1, size.height * 0.94)
      var pageScale = data.pageScale || 0.5
      var pageColor = data.pageColor || cc.color(255, 255, 0, 255)
      var arrOff = data.arrOff || cc.p(0, 0)
      var noBg = data.noBg || false
      var disTri = data.disTri || false
      var swallow = data.swallow
      if (swallow == null) {
            swallow = true
      }

      var mix = data.mix || 20
      var sel = data.sel || 140 //选择的方向大小
      var tri = data.tri || 90 //移动的方向大小
      var dis = 360 - tri * 2 - sel
      var aim = data.aim

      var judgeTime = data.judgeTime || 0.2
      var imgScale = data.imgScale || 1
      var listRect = {
            blue: [cc.rect(0, 0, 78, 76), cc.rect(20, 20, 20, 20)],
            yellow: [cc.rect(0, 0, 91, 89), cc.rect(20, 40, 20, 5)],
      }
      var bg = null
      if (!noBg) {
            bg = new cc.Scale9Sprite(res[sprintf("bg_biaoge_%s", color)], listRect[color][0], listRect[color][1])
            bg.width = size.width
            bg.height = size.height
      } else {
            bg = createLayout({
                  size: size,
                  op: 0,
            })
      }
      var getFun = data.getFun
      var outFun = data.outFun
      var counts = data.counts
      var mix = data.mix || 40
      var init = data.init
      if (!counts) {
            counts = []
            for (var i = 0; i < list.length; i++) {
                  counts[i] = 1
            }
      }
      var devide = null
      var beginx = null
      var beginy = null

      bg.setScale(scale)
      bg.setPosition(pos)
      bg.setAnchorPoint(0.5, 0.5)
      var laySize = cc.size(size.width + modify.x * 2, size.height + modify.y * 2)
      var lay = createLayout({
            pos: cc.p(-modify.x, -modify.y),
            size: laySize,
            op: 0,
      })
      bg.lay = lay
      lay.counts = counts
      lay.noArrow = data.noArrow || false
      lay.noAuto = data.noAuro || false
      lay.getIndex = function(pos) {
            var lay = this
            for (var i = 0; i < lay.list.length; i++) {
                  if (judgeInside({
                              item: lay.list[i],
                              pos: pos,
                        })) {
                        return i
                  }
            }
            return null
      }
      bg.reInit = function(data) {
            var bg = this
            list = data.list
            var counts = data.counts
            if (!counts) {
                  counts = []
                  for (var i = 0; i < list.length; i++) {
                        counts[i] = 1
                  }
            }
            var lay = bg.lay
            lay.counts = counts
            lay.maxPage = (((list.length % num) > 0) ? 1 : 0) + Math.floor(list.length / num) - 1
            var node = lay.moveNode
            node.removeAllChildren(true)
            lay.list = []
            for (var i = 0; i < list.length; i++) {
                  var img = new cc.Sprite(list[i])
                  img.setScale(imgScale)
                  switch (type) {
                        case "S":
                              img.setPosition(cc.p(beginx, beginy - i * devide))
                              break
                        default:
                              img.setPosition(cc.p(beginx + i * devide, beginy))
                              break
                  }
                  img.index = i
                  node.addChild(img)
                  lay.list.push(img)
            }
            node.setPosition(0, 0)
            lay.page = 0
            lay.judgeArrow()
      }
      lay.init = function() {
            var lay = this
            lay.setClippingEnabled(true)
            lay.list = []
            lay.page = 0
            lay.maxPage = (((list.length % num) > 0) ? 1 : 0) + Math.floor(list.length / num) - 1
            if (ifPage) {
                  var page = new cc.LabelBMFont("", res.listNum)
                  page.setAnchorPoint(0, 0)
                  page.setScale(pageScale)
                  page.setString(sprintf("%d/%d", lay.page + 1, lay.maxPage + 1))
                  page.setPosition(pageOff)
                  page.color = pageColor
                  bg.addChild(page)
                  lay.pageNode = page
            }
            if (!lay.noArrow) {
                  var left = new cc.Sprite(res[sprintf("btn_arrow_%s", arrow)])
                  var right = new cc.Sprite(res[sprintf("btn_arrow_%s", arrow)])
                  left.setScale(1 / scale)
                  right.setScale(1 / scale)
                  left.setAnchorPoint(0.5, 0.5)
                  right.setAnchorPoint(0.5, 0.5)
                  if (lay.type == "S") {
                        left.setRotation(180)
                        left.setPosition(size.width / 2 + arrOff.x, size.height + mix + arrOff.y)
                        right.setPosition(size.width / 2 + arrOff.x, -mix - arrOff.y)
                  } else {
                        left.setRotation(90)
                        right.setRotation(-90)
                        right.setPosition(size.width + mix - arrOff.x, size.height / 2 + arrOff.y)
                        left.setPosition(-mix + arrOff.x, size.height / 2 + arrOff.y)
                  }
                  createTouchEvent({
                        item: left,
                        swallow: swallow,
                        end: function() {
                              if (bg.isVisible()) {
                                    lay.move(false)
                              }
                        }
                  })
                  createTouchEvent({
                        item: right,
                        swallow: swallow,
                        end: function() {
                              if (bg.isVisible()) {
                                    lay.move(true)
                              }
                        }
                  })
                  bg.addChild(left)
                  bg.addChild(right)
                  lay.leftArrow = left
                  lay.rightArrow = right
                  if (!lay.noAuto) {
                        if (lay.type == "S") {
                              addShowType({
                                    item: left,
                                    show: "shakeF",
                                    time: 0.3,
                                    buf: cc.p(0, 10)
                              })
                              addShowType({
                                    item: right,
                                    show: "shakeF",
                                    time: 0.3,
                                    buf: cc.p(0, -10)
                              })
                        } else {
                              addShowType({
                                    item: left,
                                    show: "shakeF",
                                    time: 0.3,
                                    buf: cc.p(10, 0)
                              })
                              addShowType({
                                    item: right,
                                    show: "shakeF",
                                    time: 0.3,
                                    buf: cc.p(-10, 0)
                              })
                        }
                  }
            }
            if (!aim) {
                  if (lay.type == "S") {
                        aim = -90
                  } else {
                        aim = 0
                  }
            }

            createMoveRotate({
                  item: lay,
                  aim: aim,
            })

            var node = new cc.Node()
            lay.addChild(node)
            lay.moveNode = node
            for (var i = 0; i < list.length; i++) {
                  var img = new cc.Sprite(list[i])
                  img.setScale(imgScale)
                  switch (type) {
                        case "S":
                              img.setPosition(cc.p(beginx, beginy - i * devide))
                              break
                        default:
                              img.setPosition(cc.p(beginx + i * devide, beginy))
                              break
                  }
                  img.index = i
                  node.addChild(img)
                  lay.list.push(img)
            }
            lay.judgeArrow()
            var getSp = function(data) {
                  var sp = data.sp
                  var start = data.start
                  var final = data.final
                  var item = data.item
                  var index = item.getIndex(start)
                  if (index < list.length && index >= 0) {
                        if (!lay.judgeIndex(index, true)) {
                              return null
                        }
                        if (getFun) {
                              sp = getFun({
                                    index: index,
                                    pos: final,
                                    tex: list[index],
                              })
                        }
                        if (!sp) {
                              sp = new cc.Sprite(list[index])
                              sp.setPosition(bg.convertToNodeSpace(final))
                              bg.addChild(sp)
                        }
                        sp.index = index
                        if (init) {
                              init({
                                    item: sp,
                                    index: index,
                                    pos: final,
                              })
                        }
                        return sp
                  }
                  return null
            }
            createTouchEvent({
                  item: lay,
                  swallow: swallow,
                  begin: function(data) {
                        var item = data.item
                        var pos = data.pos
                        if (!bg.isVisible()) {
                              return false
                        }
                        if (disTri) {
                              var sp = null
                              sp = getSp({
                                    sp: sp,
                                    start: pos,
                                    final: pos,
                                    item: item,
                              })
                              item.startPos = pos
                              item.select = sp
                              item.judge = true
                        } else {
                              item.listenRotate(pos)
                        }
                        return true
                  },
                  move: function(data) {
                        var item = data.item
                        var pos = data.pos
                        var delta = data.delta
                        var tri = null
                        var dis = null
                        if (!disTri) {
                              tri = item.getAngle(pos)
                              dis = item.getDis(pos)
                        }
                        var sp = null
                        if (item.select) {
                              item.select.x += delta.x / getLoopScale(item.select)
                              item.select.y += delta.y / getLoopScale(item.select)
                        }

                        if (!item.judge) {
                              if (dis >= mix && (tri == "down" || tri == "up")) {
                                    item.judge = true
                                    if (!item.select) {
                                          sp = getSp({
                                                sp: sp,
                                                start: item.startPos,
                                                final: pos,
                                                item: item,
                                          })
                                          item.select = sp
                                    }
                              }
                              if (dis >= mix && (tri == "left" || tri == "right")) {
                                    item.judge = true
                                    item.tri = tri
                              }
                        } else {
                              if (!item.select && !item.tri) {
                                    sp = getSp({
                                          sp: sp,
                                          start: item.startPos,
                                          final: pos,
                                          item: item,
                                    })
                                    item.select = sp
                              }
                        }
                  },
                  end: function(data) {
                        var item = data.item
                        var pos = data.pos
                        if (item.select) {
                              if (outFun) {
                                    item.select.retain()
                                    item.select.removeFromParent(false)
                                    outFun({
                                          item: item.select,
                                          pos: pos,
                                          index: item.select.index,
                                    })
                                    item.select.release()
                                    item.select = null
                              } else {
                                    item.select.removeFromParent(true)
                                    lay.judgeIndex(item.select.index, false)
                                    item.select = null
                              }
                        } else {
                              switch (item.tri) {
                                    case "left":
                                          item.move(true)
                                          break
                                    case "right":
                                          item.move(false)
                                          break
                                    default:
                                          break
                              }
                        }
                  }
            })
      }
      lay.judgeIndex = function(index, out) {
            var lay = this
            if (index >= 0 && index < lay.list.length) {
                  if (out) {
                        if (lay.counts[index] > 0) {
                              lay.counts[index]--
                                    if (lay.counts[index] == 0) {
                                          lay.list[index].setOpacity(127)
                                    }
                              return true
                        }
                        return false
                  } else {
                        lay.counts[index]++
                              lay.list[index].setOpacity(255)
                        return true
                  }
            }
      }
      bg.judgeIndex = function(index, out) {
            lay.judgeIndex(index, out)
      }
      lay.judgeBack = function(data) {
            var lay = this
            var index = data.index
            var pos = data.pos
            if (judgeInside(lay, pos)) {
                  lay.judgeIndex(index, false)
                  lay.list[index].setOpacity(255)
                  return true
            }
            return false
      }
      if (type == "S") {
            devide = (laySize.height - offset.y * 2) / num
            beginx = laySize.width / 2 + offset.x
            beginy = laySize.height - (devide / 2 + offset.y)
            lay.type = "S"
      } else {
            devide = (laySize.width - offset.x * 2) / num
            beginx = devide / 2 + offset.x
            beginy = laySize.height / 2 + offset.y
            lay.type = "H"
      }

      lay.move = function(forward) {
            var lay = this
            var buf = null
            if (forward) {
                  if (lay.page < lay.maxPage) {
                        if (lay.type == "S") {
                              buf = cc.p(0, laySize.height)
                        } else {
                              buf = cc.p(-laySize.width, 0)
                        }
                        lay.page++
                  }
            } else {
                  if (lay.page > 0) {
                        if (lay.type == "S") {
                              buf = cc.p(0, -laySize.height)
                        } else {
                              buf = cc.p(laySize.width, 0)
                        }
                        lay.page--
                  }
            }
            if (buf) {
                  if (lay.pageNode) {
                        lay.pageNode.setString(sprintf("%d/%d", lay.page + 1, lay.maxPage + 1))
                  }
                  addShowType({
                        item: lay.moveNode,
                        show: "moveBy",
                        buf: buf,
                        time: 0.1,
                        fun: function() {
                              lay.judgeArrow()
                        }
                  })
            }
      }
      lay.judgeArrow = function() {
            if (!lay.noArrow) {
                  var judgeleft = false
                  var judgeright = false
                  if (lay.page > 0) {
                        judgeleft = true
                  }
                  if (lay.page < lay.maxPage) {
                        judgeright = true
                  }
                  lay.leftArrow.setVisible(judgeleft)
                  lay.rightArrow.setVisible(judgeright)
            }
      }
      bg.addChild(lay)
      lay.init()
      return bg
}

createList = func.createList

func.getRandKey = function() {
      return sprintf("RANDOMKEY%d", keyGen++)
}

getRandKey = func.getRandKey

func.getEllipsePoint = function(data) {
      var a = data.a
      var b = data.b
      var devide = data.devide || 0.1 //取点间隔
      var result = []
      var startx = a
      while (startx >= -a) {
            result.push(cc.p(startx, Math.sqrt(1 - startx * startx / a / a) * b))
            startx -= devide
      }
      startx += devide
      result.push(cc.p(-a, Math.sqrt(1 - a * a / a / a) * b))
      while (startx <= a) {
            result.push(cc.p(startx, -Math.sqrt(1 - startx * startx / a / a) * b))
            startx += devide
      }
      return result
}

getEllipsePoint = func.getEllipsePoint

func.goWithEll = function(data) {
      var item = data.item
      var init = data.init
      item.time = data.time
      item.curX = data.startx
      item.delay = data.delay || 0
      item.offset = data.offset || cc.p(0, 0)
      item.curJudge = true
      item.a = data.a
      item.b = data.b
      item.mix = data.mix
      item.focus = data.focus || "LEFT" //"RIGHT"
      switch (item.focus) {
            case "RIGHT":
                  item.focus = cc.p(Math.sqrt(item.a * item.a - item.b * item.b), 0)
                  break
            default:
                  item.focus = cc.p(-Math.sqrt(item.a * item.a - item.b * item.b), 0)
                  break
      }
      item.getDis = function() {
            var item = this
            var dis = getDis(cc.p(item.curX, item.curY), item.focus)
            return dis
      }
      item.getY = function() {
            var item = this
            var result = Math.sqrt(1 - item.curX * item.curX / item.a / item.a) * item.b

            if (item.curJudge) {
                  return result
            } else {
                  return -result
            }
      }
      item.getMix = function() {
            var result = Math.atan(Math.abs(-item.b * item.b * item.curX / (item.a * item.a * item.curY))) / Math.PI * 180
            return result
      }
      item.change = function() {
            var item = this
            item.curY = item.getY()
            item.curMix = item.getMix()
            item.setPosition(item.curX + item.offset.x, item.curY + item.offset.y) //wrong!!!!
            var dis = 1 / item.getDis() / item.curMix * item.mix
            if (item.curJudge) {
                  item.curX -= dis
                  if (item.curX < -item.a) {
                        item.curX = -item.a
                        item.curJudge = false
                  }
            } else {
                  item.curX += dis
                  if (item.curX > item.a) {
                        item.curX = item.a
                        item.curJudge = true
                  }
            }
      }
      if (init) {
            item.change()
      }
      item.key = getRandKey()
      addTimer({
            fun: function() {
                  item.change()
            },
            delay: item.delay,
            time: item.time,
            repeat: cc.REPEAT_FOREVER,
            key: item.key,
      })
}

goWithEll = func.goWithEll

func.goWithPos = function(data) {
      var item = data.item
      var posList = data.posList
      var time = data.time
      var repeat = data.repeat
      var delay = data.delay
      var init = data.init
      var rootPos = data.rootPos || cc.p(0, 0)
      item.rootPos = rootPos
      item.current = 0
      item.loop = 0
      item.posList = posList
      item.repeatMax = repeat
      item.key = getRandKey()
      item.backFun = data.backFun
      item.changePos = function() {
            var item = this
            var next = item.posList[item.current]
            item.stopAllActions()
            addShowType({
                  item: item,
                  show: "moveTo",
                  time: time,
                  buf: cc.p(item.rootPos.x + next.x, item.rootPos.y + next.y),
                  fun: function(item) {
                        item.current = item.current + 1
                        if (item.current >= item.posList.length) {
                              item.loop = item.loop + 1
                              item.current = 1
                              if (item.loop >= item.repeatMax) {
                                    removeTimer(item.key)
                                    if (item.backFun) {
                                          item.backFun()
                                    }
                                    return
                              }
                        }
                        item.changePos()
                  }
            })
      }
      item.stopAct = function() {
            var item = this
            item.stopAllActions()
            removeTimer(item.key)
      }
      if (init) {
            var next = item.posList[item.current]
            item.setPosition(item.rootPos.x + next.x, item.rootPos.y + next.y)
            item.current++
      }
      item.changePos()
}

goWithPos = func.goWithPos

func.drawEllipse = function(data) {
      var father = data.father || new cc.DrawNode()
      var buf = data.buf
      var color = data.color || cc.color(255, 0, 0, 255)
      var seg = data.seg || 2
      for (var i = 0; i < buf.length - 1; i++) {
            father.drawSegment(buf[i], buf[i + 1], seg, color)
      }
      return father
}

drawEllipse = func.drawEllipse

func.drawLines = function(data) {
      var father = data.father || new cc.DrawNode()
      var buf = data.buf
      var offset = data.offset || cc.p(0, 0)
      var color = data.color || cc.color(255, 0, 0, 255)
      var seg = data.seg || 2
      for (var i = 0; i < buf.length - 1; i++) {
            father.drawSegment(cc.p(buf[i].x + offset.x, buf[i].y + offset.y), cc.p(buf[i + 1].x + offset.x, buf[i + 1].y + offset.y), seg, color)
      }
      return father
}

drawLines = func.drawLines

func.blink = function(data) {
      var item = data.item
      var normal = data.normal || "normal"
      var select = data.select || "select"
      var current = data.current || false
      var time = data.time || 0.1
      var count = data.count || cc.REPEAT_FOREVER
      var after = data.after
      if (item) {
            if (item.getChildByName) {
                  item.normal = normal
                  item.select = select
            }
            item.judge = current
            item.time = time
            item.key = getRandKey()
            item.show = function() {
                  var item = this
                  var tnormal = null
                  var tselect = null
                  if (item.getChildByName) {
                        tnormal = item.getChildByName(item.normal)
                        tselect = item.getChildByName(item.select)
                  } else {
                        tnormal = item.normal
                        tselect = item.select
                  }
                  tnormal.setVisible(item.judge)
                  tselect.setVisible(!item.judge)
                  item.judge = !item.judge
            }
            addTimer({
                  fun: function() {
                        item.show()
                  },
                  time: item.time,
                  key: item.key,
                  repeat: count,
                  after: function() {
                        if (after) {
                              after()
                        }
                  }
            })
            item.show()
      }
}

blink = func.blink

func.disBlink = function(item) {
      if (item.key) {
            removeTimer(item.key)
      }
}

disBlink = func.disBlink

func.createPages = function(data) {
      var father = data.father
      var pics = data.pics
      var posOff = data.posOff
      var scales = data.scales
      var numsModify = data.numsModify || cc.p(6, 12)
      var layer = data.layer
      var mixLimit = 100
      var borderLimit = 120
      var jdtHeight = 90
      var mix = 20
      var time = 0.1
      var moveFun = data.moveFun

      var tempShow = createLayout({
            pos: cc.p(0, 0),
            size: cc.director.getWinSize(),
            op: 0,
      })
      tempShow.curIndex = 0
      tempShow.maxIndex = pics.length
      tempShow.setLocalZOrder(0)

      tempShow.setClippingEnabled(true)
      tempShow.setCascadeOpacityEnabled(true)

      father.addChild(tempShow)
      tempShow.list = []
      var winsize = cc.director.getWinSize()
      for (var k = 0; k < pics.length; k++) {
            var pic = pics[k]
            var img = new ccui.ImageView(pic)
            var off = cc.p(0, 0)
            if (posOff && posOff[k] != null) {
                  off = posOff[k]
            }
            img.setPosition(getMiddle(k * winsize.width + off.x, off.y))
            tempShow.addChild(img)
            tempShow.list.push(img)
            if (k == 0) {
                  tempShow.minPos = img.getPosition()
            }
            if (scales && scales[k] != null) {
                  img.setScale(scales[k])
            }
      }

      if (pics.length > 1) {
            if (!tempShow.jdt) {
                  var jdt = new cc.Scale9Sprite(res.img_jdt, cc.rect(0, 0, 13, 13), cc.rect(4, 0, 5, 0))
                  jdt.setAnchorPoint(0, 0.5)
                  jdt.height = 13
                  var screenW = cc.director.getWinSize().width
                  jdt.width = (screenW - borderLimit * 2 - mixLimit) / pics.length
                  tempShow.addChild(jdt)
                  tempShow.jdt = jdt
                  jdt.devide = (screenW - borderLimit * 2) / pics.length
                  jdt.setPosition(cc.p(borderLimit, jdtHeight))
                  jdt.rootX = jdt.getPositionX()
                  jdt.judge = (screenW - borderLimit * 2)
            }
      }

      tempShow.Move = function() {
            this.changePage()
            var item = this
            var dis = item.minPos.x - item.list[item.curIndex].x
            var count = 0
            item.Moving = true
            for (var i = 0; i < item.list.length; i++) {
                  var img = item.list[i]
                  count++
                  addShowType({
                        item: img,
                        show: "moveBy",
                        time: time,
                        buf: cc.p(dis, 0),
                        fun: function() {
                              count--
                              if (count == 0) {
                                    item.Moving = false
                              }
                        }
                  })
            }
            if (moveFun) {
                  moveFun()
            }
      }

      tempShow.changePage = function() {
            var node = this
            if (!layer.pageNum) {
                  var img = layer.img_page
                  var temp = new cc.LabelBMFont("", res.nums)
                  temp.setAnchorPoint(0.5, 0.5)
                  var size = img.getContentSize()
                  temp.setPosition(size.width / 2 + numsModify.x, size.height / 2 + numsModify.y)
                  img.addChild(temp)
                  layer.pageNum = temp
            }
            var num = layer.pageNum
            num.setString(sprintf("%d/%d", node.curIndex + 1, node.maxIndex))
            if (node.jdt) {
                  var jdt = node.jdt
                  jdt.stopAllActions()
                  var target = jdt.rootX + node.curIndex * jdt.devide
                  addShowType({
                        item: jdt,
                        show: "moveTo",
                        buf: cc.p(target, jdtHeight),
                        time: time,
                  })
            }
      }
      if (pics.length >= 1) {
            tempShow.isShowPage = true
            createTouchEvent({
                  item: tempShow,
                  swallow: false,
                  begin: function(data) {
                        var item = data.item
                        var pos = data.pos
                        if (!item.Moving && item.isVisible() && item.getParent().isVisible()) {
                              item.startPos = pos
                              return true
                        } else {
                              return false
                        }
                  },
                  move: function(data) {
                        var item = data.item
                        var pos = data.pos
                        var delta = data.delta
                        for (var i = 0; i < item.list.length; i++) {
                              var img = item.list[i]
                              img.x += delta.x
                        }
                        if (item.jdt) {
                              var jdt = item.jdt
                              var judgex = delta.x * (jdt.devide / jdt.judge)
                              jdt.x -= judgex
                        }
                  },
                  end: function(data) {
                        var item = data.item
                        var pos = data.pos
                        var dis = pos.x - item.startPos.x
                        var judge = dis > 0 ? -1 : 1
                        var abs = Math.abs(dis)
                        if (abs > mix) {
                              if (item.list[item.curIndex + judge]) {
                                    item.curIndex += judge
                                    item.Move()
                              } else {
                                    item.Move()
                              }
                        } else {
                              item.Move()
                        }
                  },
            })
      } else {
            tempShow.isShowPage = true
      }
      return tempShow
}

createPages = func.createPages

func.getAngleTri = function(src, dest) {
      var angle = getAngle(src, dest)
      if ((angle >= 0 && angle <= 45) || (angle >= 315 && angle <= 360)) {
            return "left"
      }
      if ((angle >= 45 && angle <= 135)) {
            return "up"
      }
      if ((angle >= 135 && angle <= 225)) {
            return "right"
      }
      if ((angle >= 225 && angle <= 315)) {
            return "down"
      }
}

getAngleTri = func.getAngleTri

func.getAngle = function(src, dest) { //计算两点之间的角度
      var xdis = dest.x - src.x
      var ydis = dest.y - src.y
      var dis = getDis(src, dest)
      var judge = false
      if (ydis < 0) {
            judge = true
      }
      var result = Math.acos(xdis / dis) / Math.PI * 180
      if (judge) {
            result = (180 - result) + 180
      }
      return result
}

getAngle = func.getAngle

func.getDis = function(src, dest) { //两点间距
      var xdis = dest.x - src.x
      var ydis = dest.y - src.y
      var dis = Math.sqrt(xdis * xdis + ydis * ydis)
      return dis
}

getDis = func.getDis

func.getMax = function(list) {
      var result = null
      if (list[0] != null) {
            result = list[0]
            for (var i = 1; i < list.length; i++) {
                  if (result < list[i]) {
                        result = list[i]
                  }
            }
      }
      return result
}

getMax = func.getMax

func.setSize = function(data) {
      var item = data.item
      var width = data.width
      var height = data.height
      var src = item.getContentSize()
      if (width) {
            item.setScaleX(width / src.width)
      }
      if (height) {
            item.setScaleY(height / src.height)
      }
}
setSize = func.setSize

func.getSizeScale = function(data) {
      var item = data.item
      var width = data.width
      var height = data.height
      var src = item.getContentSize()
      var x = 1
      var y = 1
      if (width) {
            x = width / src.width
      }
      if (height) {
            y = height / src.height
      }
      return {
            x: x,
            y: y,
      }
}

getSizeScale = func.getSizeScale

func.addInput = function(data) {
      var item = data.item
      var color = data.color || cc.color(0, 0, 0, 255)
      var holder = data.holder || ""
      var fontsize = data.size || 36
      var str = data.str || ""
      var strlen = data.strlen
      var fontType = data.fontType || "mid" // "left" "right"
      var backFun = data.backFun
      var size = item.getContentSize()
      var layOut = createLayout({
            pos: cc.p(0, 0),
            size: size,
            op: 0
      })
      item.addChild(layOut)
      item.layOut = layOut
      layOut.setClippingEnabled(true)

      if (!item.input) {
            var size = item.getContentSize()
            item.input = new ccui.TextField()
            var node = item.input
            node.setPosition(size.width / 2, size.height / 2)
            node.setString(str)
            switch (fontType) {
                  case "left":
                        node.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT)
                        break
                  case "right":
                        node.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT)
                        break
            }
            //node.setTouchSize(size)
            //
            node.setFontSize(fontsize)
            node.maxLen = strlen
            node.setPlaceHolder(holder)
            node.setTextColor(color)
            item.layOut.addChild(node)
            node.addEventListener(function(target, event) {
                  if (event == ccui.TextField.EVENT_DETACH_WITH_IME) {
                        if (backFun) {
                              backFun(item)
                        }
                        if (node.light) {
                              node.light.stopAllActions()
                              node.light.setVisible(false)
                              node.light.removeFromParent(true)
                              node.light = null
                        }
                        node.judgeLimit()
                  }
                  if (event == ccui.TextField.EVENT_ATTACH_WITH_IME) {
                        if (!node.light) {
                              var light = new cc.Sprite(res.img_input_light)
                              light.setColor(color)
                              node.light = light
                              setSize({
                                    item: light,
                                    width: fontsize / 10,
                                    height: fontsize,
                              })
                              node.addChild(light)
                        }
                        if (node.light) {
                              node.light.stopAllActions()
                              addShowType({
                                    item: light,
                                    show: "blink",
                                    repeat: cc.REPEAT_FOREVER,
                                    time: 0.8,
                              })
                              node.light.setVisible(true)
                              node.judgeLight()
                        }
                  }
                  if (event == ccui.TextField.EVENT_INSERT_TEXT || event == ccui.TextField.EVENT_DELETE_BACKWARD) {
                        node.judgeLight()
                  }
            })
            node.judgeLimit = function() {
                  var node = this
                  if (node.maxLen != null) {
                        var str = node.getString()
                        if (str.length > node.maxLen) {
                              node.setString(str.substr(0, node.maxLen))
                        }
                  }
            }
            node.judgeLight = function() {
                  var node = this
                  if (node.light) {
                        var light = node.light
                        if (node.width != 0) {
                              node.light.setAnchorPoint(0, 0.35)
                              node.light.setPosition(node.width, fontsize / 2)
                              safeAdd(node, node.light)
                        } else {
                              node.light.setAnchorPoint(0, 0.5)
                              node.light.setPosition(size.width / 2, size.height / 2)
                              safeAdd(item, node.light)
                        }
                  }
            }
      }
      item.getStr = function() {
            var item = this
            if (item.input) {
                  return item.input.getString()
            }
            return null
      }
      item.setAnswer = function(judge) {
            var item = this
            var size = item.getContentSize()
            if (!item.img_correct) {
                  var sp = new cc.Sprite("#img_correct.png")
                  sp.setAnchorPoint(1, 0)
                  sp.setPosition(size.width, 0)
                  safeAdd(item, sp)
                  item.img_correct = sp
            }
            if (!item.img_fault) {
                  var sp = new cc.Sprite("#img_fault.png")
                  sp.setAnchorPoint(1, 0)
                  sp.setPosition(size.width, 0)
                  safeAdd(item, sp)
                  item.img_fault = sp
            }
            item.img_correct.setVisible(judge)
            item.img_fault.setVisible(!judge)
      }
      item.clear = function(str) {
            var item = this
            str = str || ""
            if (item.img_correct) {
                  item.img_correct.setVisible(false)
            }
            if (item.img_fault) {
                  item.img_fault.setVisible(false)
            }
            if (item.input) {
                  item.input.setString(str)
            }
            if (node.light) {
                  node.light.stopAllActions()
                  node.light.setVisible(false)
                  node.light.removeFromParent(true)
                  node.light = null
            }
      }

      if (item.setTouchEnabled) {
            item.setTouchEnabled(false)
      }
      createTouchEvent({
            item: item,
            end: function(data) {
                  var item = data.item
                  item.input.attachWithIME()
            }
      })
}

addInput = func.addInput

func.getMin = function(list) {
      var result = null
      if (list[0] != null) {
            result = list[0]
            for (var i = 1; i < list.length; i++) {
                  if (result > list[i]) {
                        result = list[i]
                  }
            }
      }
      return result
}

getMin = func.getMin

func.judgeNum = function(str) {
      if (str.length == 1) {
            var tempNum = str.charCodeAt(0)
            return tempNum >= 48 && tempNum <= 57 //ascii 0-9 
      }
      return false
}

judgeNum = func.judgeNum

func.judgeContain = function(src, dst) {
      for (var i = 0; i < src.length; i++) {
            if (src[i] == dst) {
                  return true
            }
      }
      return false
}

judgeContain = func.judgeContain

func.getRand = function(nums) { //获取(0, nums-1)的随机不重复数组
      var result = []
      var temp = []
      for (var i = 0; i < nums; i++) {
            temp[i] = i
      }
      for (var i = nums, j = 0; i > 0; i--, j++) {
            var judge = Math.floor(Math.random() * i)
            result[j] = temp[judge]
            temp.splice(judge, 1)
      }
      return result
}

getRand = func.getRand

func.mixArray = function(array) { //获取(0, nums-1)的随机不重复数组
      var result = []
      var temp = []
      var nums = array.length
      var final = []
      for (var i = 0; i < nums; i++) {
            temp[i] = i
      }
      for (var i = nums, j = 0; i > 0; i--, j++) {
            var judge = Math.floor(Math.random() * i)
            result[j] = temp[judge]
            temp.splice(judge, 1)
      }

      for (var i = 0; i < result.length; i++) {
            final[i] = array[result[i]]
      }
      return final
}

mixArray = func.mixArray

func.createSetting = function(data) { //创建设置按钮
      var pos = data.pos //参数为世界坐标位置
      var sound = data.sound
      if (sound == null) {
            sound = true
      }
      var biaogeFun = data.biaogeFun //设置中如果有表格 则需要传入表格创建函数
      var tubiaoData = data.tubiaoData //设置中如果有图表 需要传入图表的初始化参数
      var ifCount = data.ifCount
      var nums = 1
      var perwidth = 110
      var height = 110
      var bound = 20
      var mix = 30
      var showtime = 0.3
      var father = data.father || CC_CURRENT_LAYER
      if (biaogeFun) {
            nums++
      }
      if (tubiaoData) {
            nums++
      }
      if (ifCount) {
            nums++
      }
      if (sound) {
            nums++
      }
      var size = cc.size(perwidth * nums + bound * 2, height)
      var rootpos = cc.p(size.width + mix, 0)
      var result = new ccui.ImageView(res.btn_set_normal)
      result.showIn = function() {
            var self = this
            if (!self.show && !self.showing) {
                  self.loadTexture(res.btn_set_select)
                  if (!self.lay) {
                        self.lay = new ccui.Layout()
                        var lay = self.lay
                        lay.setContentSize(size)
                              //lay.setBackGroundColor(cc.color(255, 0, 0, 255))
                              //lay.setBackGroundColorOpacity(255)
                              //lay.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID)
                        lay.setClippingEnabled(true)
                        lay.setAnchorPoint(0, 0.5)
                        lay.setPosition(-size.width + mix, self.getContentSize().height / 2)
                        lay.setLocalZOrder(-1)
                        self.addChild(lay)
                        self.dialog = new cc.Scale9Sprite(res.img_box, cc.rect(0, 0, 82, 91), cc.rect(30, 20, 20, 50))
                        var dialog = self.dialog
                        dialog.width = size.width
                        dialog.height = size.height
                        dialog.setAnchorPoint(0, 0)
                        dialog.setPosition(rootpos)
                        lay.addChild(dialog)

                        var list = []

                        if (biaogeFun) {
                              list[list.length] = {
                                    normal: res.btn_biaoge_normal,
                                    select: res.btn_biaoge_select,
                                    fun: biaogeFun
                              }
                        }

                        if (tubiaoData) {
                              list[list.length] = {
                                    normal: res.btn_tubiao_normal,
                                    select: res.btn_tubiao_select,
                                    fun: function() {
                                          var father = tubiaoData.father
                                          if (!father) {
                                                return
                                          }
                                          if (!father._tubiao) {
                                                father._tubiao = createTubiao(tubiaoData)
                                          }
                                          var node = father._tubiao
                                          if (!node.showing) {
                                                if (!node.show) {
                                                      node.in()
                                                } else {
                                                      node.out()
                                                }
                                          }
                                    }
                              }
                        }

                        if (ifCount) {
                              list[list.length] = {
                                    normal: res.btn_cal_normal,
                                    select: res.btn_cal_select,
                                    fun: function() {
                                          if (!father.COUNTER) {
                                                father.COUNTER = createCounter()
                                                father.addChild(father.COUNTER)
                                          }
                                          var node = father.COUNTER
                                          if (!node.act) {
                                                node.show()
                                          } else {
                                                node.close()
                                          }
                                    }
                              }
                        }

                        list[list.length] = {
                              normal: res.btn_camare_normal,
                              select: res.btn_camare_select,
                              fun: null, //后续添加
                        }
                        if (sound) {
                              list[list.length] = {
                                    normal: res.btn_sound_on,
                                    select: res.btn_sound_off,
                                    fun: function(judge) {
                                          if (!judge) {
                                                if (MUSIC_VOL == null) {
                                                      MUSIC_VOL = cc.audioEngine.getMusicVolume()
                                                }
                                          }
                                          IF_SOUND_ON = judge
                                          cc.audioEngine.setMusicVolume(IF_SOUND_ON ? MUSIC_VOL : 0)
                                    }, //后续添加
                                    type: "check",
                                    init: !IF_SOUND_ON,
                                    scale: 0.8,
                              }
                        }

                        for (var i = 0; i < list.length; i++) {
                              var temp = list[i]
                              temp.type = temp.type || "btn"
                              var tempItem = null
                              var needfun = true
                              switch (temp.type) {
                                    case "btn":
                                          tempItem = new ccui.Button(temp.normal, temp.select)
                                          break
                                    case "check":
                                          needfun = false
                                          tempItem = createJudgeBtn({
                                                normal: temp.normal,
                                                select: temp.select,
                                                fun: function(item) {
                                                      if (item.fun) {
                                                            item.fun(false)
                                                      }
                                                },
                                                back: function(item) {
                                                      if (item.fun) {
                                                            item.fun(true)
                                                      }
                                                },
                                          })
                                          temp.init = temp.init
                                          if (temp.init == null) {
                                                temp.init = true
                                          }
                                          tempItem.change(temp.init, false)
                                          break
                              }
                              tempItem.setScale(temp.scale || 1)
                              tempItem.setAnchorPoint(0.5, 0.5)
                              tempItem.setPosition(bound + perwidth / 2 + perwidth * i, height / 2)
                              tempItem.fun = temp.fun
                              if (needfun) {
                                    tempItem.addClickEventListener(function(sender) {
                                          if (sender.fun) {
                                                sender.fun()
                                          }
                                    })
                              }
                              dialog.addChild(tempItem)
                        }
                  }
                  self.showing = true
                  addShowType({
                        item: self.dialog,
                        show: "moveTo",
                        time: showtime,
                        buf: cc.p(0, 0),
                        fun: function() {
                              self.showing = false
                        }
                  })
                  self.show = true
            }
      }
      result.showOut = function() {
            var self = this
            if (self.dialog && self.show && !self.showing) {
                  self.loadTexture(res.btn_set_normal)
                  self.showing = true
                  self.show = false
                  addShowType({
                        item: self.dialog,
                        show: "moveTo",
                        time: showtime,
                        buf: rootpos,
                        fun: function() {
                              self.showing = false
                        }
                  })
            }
      }
      if (pos) {
            result.setPosition(pos)
      }
      createTouchEvent({
            item: result,
            end: function(data) {
                  var self = data.item
                  if (!self.showing) {
                        if (!self.show) {
                              self.showIn()
                        } else {
                              self.showOut()
                        }
                  }
            }
      })
      return result
}

createSetting = func.createSetting

func.judgeIn = function(item, pos, modify) { //判定pos是否在经过modify之后的item中 pos为世界坐标
      modify = modify || cc.p(1, 1) //item的区域缩放
      if (modify.x < 1) {
            modify.x = 1
      }
      if (modify.y < 1) {
            modify.y = 1
      }
      pos = item.convertToNodeSpace(pos)
      var s = item.getContentSize()
      var rect = cc.rect((1 - modify.x) / 2 * s.width, (1 - modify.y) / 2 * s.height, s.width * modify.x, s.height * modify.y)
      return cc.rectContainsPoint(rect, pos)
}
judgeIn = func.judgeIn

func.createTouchEvent = function(data) { //创建触摸监听函数
      var begin = data.begin //开始 移动 结束的监听 可以不传入 如果传入了begin需要在begin函数中进行返回 true可继续监听 false停止当次监听
      var move = data.move //三个监听函数的data中都包含 item pos 分别是触摸的对象和触摸的世界坐标 移动函数会传入delta 表示移动参数
      var end = data.end
      var beginfail = data.beginfail
      var item = data.item
      var rect = data.rect
      var force = data.force || false
      var touchX = data.touchX || 0
      var touchY = data.touchY || cc.winSize.height
      var autoMove = data.autoMove || false
      var swallow = data.swallow //是否吞噬触摸
      if (swallow != false) {
            swallow = true
      }
      if (item.removeListen) {
            item.removeListen()
            item.removeListen = null
      }
      if (item.setTouchEnabled) {
            item.setTouchEnabled(false)
      }
      var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: swallow,
            onTouchBegan: function(touch, event) {
                  var target = event.getCurrentTarget()
                  var touchpos = touch.getLocation()
                  if (touchpos.y < touchX || touchpos.y > touchY)
                        return false

                  var locationInNode = target.convertToNodeSpace(touchpos)
                  var s = target.getContentSize()
                  var inrect = rect || cc.rect(0, 0, s.width, s.height)
                  if (target.disLis) {
                        return false
                  }
                  if (cc.rectContainsPoint(inrect, locationInNode) || force) {
                        if (begin) {
                              return begin({
                                    item: target,
                                    pos: touch.getLocation()
                              })
                        }
                        return true;
                  } else {
                        if (beginfail) {
                              return beginfail({
                                    item: target,
                                    pos: touch.getLocation()
                              })
                        }

                        return false;
                  }

            },
            onTouchMoved: function(touch, event) {
                  var target = event.getCurrentTarget()
                  var delta = touch.getDelta()
                  if (move) {
                        move({
                              item: target,
                              pos: touch.getLocation(),
                              delta: delta,
                        })
                  } else {
                        if (autoMove) {
                              target.x += (delta.x / getLoopScale(target))
                              target.y += (delta.y / getLoopScale(target))
                        }
                  }
            },
            onTouchEnded: function(touch, event) {
                  var target = event.getCurrentTarget()
                  if (end) {
                        end({
                              item: target,
                              pos: touch.getLocation(),
                        })
                  }
            }
      })
      item.listener = listener
      item.disListen = function(judge) {
            if (judge == null) {
                  judge = true
            }
            var item = this
            item.disLis = judge
      }
      item.removeListen = function() {
            if (this.listener) {
                  cc.eventManager.removeListener(this.listener)
                  this.listener = null
            }
      }
      cc.eventManager.addListener(listener, item)
}

createTouchEvent = func.createTouchEvent

func.copyEvent = function(src, dest) {
      if (src.listener) {
            cc.eventManager.addListener(src.listener.clone(), dest)
            if (!dest.removeListen && src.removeListen) {
                  dest.removeListen = src.removeListen
            }
      }
}

copyEvent = func.copyEvent

func.getLoopScale = function(item) {
      var scale = 1
      var temp = item
      while (temp.getParent()) {
            scale *= temp.getParent().getScale()
            temp = temp.getParent()
      }
      return scale
}

getLoopScale = func.getLoopScale

func.addMoving = function(item, swallow, testflag) { //对目标对象添加触摸移动
      if (swallow == null) {
            swallow = true
      }
      var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: swallow,
            onTouchBegan: function(touch, event) {
                  var target = event.getCurrentTarget()
                  var locationInNode = target.convertToNodeSpace(touch.getLocation())
                  var s = target.getContentSize()
                  var rect = cc.rect(0, 0, s.width, s.height)
                  if (cc.rectContainsPoint(rect, locationInNode)) {
                        target.judgeScale = getLoopScale(target) || 1
                        if (item.changeSelfLocalZero)
                              item.changeSelfLocalZero()
                        return true;
                  }
                  return false;
            },
            onTouchMoved: function(touch, event) {
                  var target = event.getCurrentTarget()
                  var delta = touch.getDelta()
                  target.x += (delta.x / target.judgeScale)
                  target.y += (delta.y / target.judgeScale)
                  if (testflag) {
                        cc.log("x:", target.x, "y:", target.y)
                  }
            },
      })
      item.listener = listener1
      cc.eventManager.addListener(listener1, item);
}

addMoving = func.addMoving

func.removeMoving = function(item) { //删除目标对象的触摸移动
      if (item.listener) {
            cc.eventManager.removeListener(item.listener)
            item.listener = null
      }
}

removeMoving = func.removeMoving

func.createControlAni = function(data) { //创建可控action 目前提供暂停 前进 以及回退
      var frame = data.frame //frame字符串 类似 xxxx%02d.png
      var start = data.start || 1 //起始帧
      var end = data.end //结束帧
      var time = data.time //帧间隔
      var key = data.key //对应的计时器标签
      var item = data.item //修改贴图的对象 传入new cc.Sprite()即可
      var index = data.beginIndex //创建后展示的第一帧
      var files = []
      for (var i = start; i <= end; i++) {
            files[i] = sprintf(frame, i)
      }
      var control = {
            tri: "stop",
            cur: index,
            start: start,
            end: end,
            fun: null,
      }
      addTimer({
            fun: function() {
                  switch (control.tri) {
                        case "forward":
                              if (control.cur <= control.end) {
                                    if (files[control.cur]) {
                                          item.setSpriteFrame(files[control.cur])
                                    }
                                    control.cur++
                              } else {
                                    if (control.fun) {
                                          control.fun()
                                          control.fun = null
                                    }
                              }
                              break
                        case "back":
                              if (control.cur >= control.start) {
                                    if (files[control.cur]) {
                                          item.setSpriteFrame(files[control.cur])
                                    }
                                    control.cur--
                              } else {
                                    if (control.fun) {
                                          control.fun()
                                          control.fun = null
                                    }
                              }
                              break
                        case "stop":
                              break
                  }
            },
            delay: 0,
            time: time,
            repeat: cc.REPEAT_FOREVER,
            key: key
      })
      control.changeStatus = function(statu, fun) {
            //statu包括back forward stop以及对应的到达起始帧或者最后一帧需要调用的函数 暂停不提供函数调用
            control.tri = statu
            control.fun = fun
      }
      return control
}

createControlAni = func.createControlAni

func.getWorldPos = function(item) { //获取指定对象的世界坐标
      if (item.getParent) {
            var par = item.getParent()
            if (par) {
                  return par.convertToWorldSpace(item.getPosition())
            } else {
                  return item.getPosition()
            }
      } else {
            return item.getPosition()
      }
}

getWorldPos = func.getWorldPos

func.get4Pos = function(item, modify) {
      var result = {}
      var anchor = item.getAnchorPoint()
      var size = item.getContentSize()
      var pos = getWorldPos(item)
      result.left = pos.x - size.width * anchor.x + modify.x
      result.right = pos.x + size.width * (1 - anchor.x) + modify.x
      result.bottom = pos.y - size.height * anchor.y + modify.y
      result.top = pos.y + size.height * (1 - anchor.y) + modify.y
      return result
}

get4Pos = func.get4Pos

func.judgeTouch = function(data) {
      var box = data.box
      var item = data.item
      var pos = data.pos
      var judgex = false
      var judgey = false
      for (var i = 0; i < box.boxs.length; i++) {
            var cur = box.boxs[i]
            if (!judgex) {
                  var current = get4Pos(item, cc.p(pos.x, 0))
                  if (judgeCrash(current, cur, true)) {
                        judgex = true
                  }
            }
            if (!judgey) {
                  var current = get4Pos(item, cc.p(0, pos.y))
                  if (judgeCrash(current, cur, true)) {
                        judgey = true
                  }
            }
      }
      if (!judgex) {
            item.x += pos.x
      }
      if (!judgey) {
            item.y += pos.y
      }
      return judgey || judgex
}

judgeTouch = func.judgeTouch

func.judgeCrash = function(src, dest, need) {
      need = need || false
      if (src.left > dest.left && src.left < dest.right) {
            if (src.bottom > dest.bottom && src.bottom < dest.top) {
                  return true
            }
            if (src.top > dest.bottom && src.top < dest.top) {
                  return true
            }
      }
      if (src.right > dest.left && src.right < dest.right) {
            if (src.bottom > dest.bottom && src.bottom < dest.top) {
                  return true
            }
            if (src.top > dest.bottom && src.top < dest.top) {
                  return true
            }
      }
      if (need) {
            return judgeCrash(dest, src)
      }
      return false
}

judgeCrash = func.judgeCrash

func.createBoxs = function(data) {
      var boxs = data.boxs
      var op = data.op
      var node = new cc.Node()
      node.setPosition(0, 0)
      node.setAnchorPoint(0, 0)
      node.boxs = []
      for (var i = 0; i < boxs.length; i++) {
            var rect = boxs[i]
            var lay = createLayout({
                  pos: rect.pos,
                  size: rect.size,
                  op: op
            })
            lay.left = rect.pos.x
            lay.right = rect.pos.x + rect.size.width
            lay.top = rect.pos.y + rect.size.height
            lay.bottom = rect.pos.y
            node.boxs[i] = lay
            node.addChild(lay)
      }
      return node
}

createBoxs = func.createBoxs

func.linkBox = function(item) {
      var box = createLayout({
            pos: cc.p(0, 0),
            size: item.getContentSize(),
            op: 100,
            color: cc.color(0, 255, 0, 255)
      })
      item.addChild(box)
}

linkBox = func.linkBox

func.createLayout = function(data) {
      var pos = data.pos || cc.p(0, 0)
      var size = data.size
      var op = data.op || 0
      var clip = data.clip || false
      var color = data.color || cc.color(255, 0, 0, 255)
      var lay = new ccui.Layout()
      lay.setBackGroundColor(color)
      lay.setBackGroundColorOpacity(op)
      lay.setContentSize(size) //resize
      lay.setPosition(pos)
      lay.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID)
            //lay.setTouchEnabled(true)
            //lay.setSwallowTouches(false)
      lay.setClippingEnabled(clip)
            //lay.setAnchorPoint(layoutAnchor)
      return lay
}
createLayout = func.createLayout

func.createPageView = function(data) {
      data = data || {}
      var pix = data.pix || 10
      var files = data.files
      var fun = data.fun
      var devide = data.devide || 100
      var node = new cc.Node()
      var time = data.time || 0.1
      node.items = []
      node.setPosition(getMiddle())
      node.Stop = function() {
            for (var i = 0; i < this.items.length; i++) {
                  var item = this.items[i]
                  item.stopAllActions()
            }
      }
      node.Move = function(data) {
            var page = data.page
            var pox = data.pox
            var intime = data.time
            var self = this
            if (pox != null) {
                  for (var i = 0; i < self.items.length; i++) {
                        var item = self.items[i]
                        if (intime) {
                              addShowType({
                                    item: item,
                                    show: "moveBy",
                                    time: intime,
                                    buf: cc.p(pox, 0),
                                    fun: function() {
                                          self.changeOP()
                                          if (page != null) {
                                                self.curIndex = page
                                          }
                                    }
                              })
                        } else {
                              item.x += pox
                        }
                  }
            } else if (page != null) {
                  if (page < 0) {
                        page = 0
                  }
                  if (page >= self.items.length) {
                        page = self.items.length - 1
                  }
                  var item = self.items[page]
                  var dis = 0 - item.x
                  self.Move({
                        pox: dis,
                        time: time,
                        page: page
                  })
            }
      }
      node.getPage = function() {
            return this.curIndex
      }
      node.changeOP = function() {
            for (var i = 0; i < this.items.length; i++) {
                  var item = this.items[i]
                  if (i == this.curIndex) {
                        item.setOpacity(255)
                  } else {
                        item.setOpacity(127)
                  }
            }
      }
      node.curIndex = 0
      for (var i = 0; i < files.length; i++) {
            var back = new ccui.ImageView(res.img_exp_kuang)
            var item = new ccui.ImageView(files[i])
            var exp = new ccui.ImageView(res[sprintf("img_exp%d", i + 1)])
            exp.setPosition(50, 360)
            item.setAnchorPoint(cc.p(-0.1, -0.08))
            item.setLocalZOrder(-1)
            back.addChild(item)
            back.addChild(exp)
            back.setPosition(cc.p((back.getContentSize().width + devide) * i, 0))
            node.addChild(back)
            node.items[i] = back
            back.index = i
            back.setCascadeOpacityEnabled(true)
      }
      var winSize = cc.director.getWinSize()
      var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                  var target = event.getCurrentTarget()
                  var rect = cc.rect(-winSize.width / 2, -200, winSize.width, 400)
                  var locationInNode = target.convertToNodeSpace(touch.getLocation())
                  if (cc.rectContainsPoint(rect, locationInNode)) {
                        node.Stop()
                        target.beginPox = touch.getLocation().x
                        return true
                  }
                  return false
            },
            onTouchMoved: function(touch, event) {
                  var target = event.getCurrentTarget()
                  var delta = touch.getDelta()
                  node.Move({
                        pox: delta.x //可能要自动修正 移出屏幕的情况
                  })
            },
            onTouchEnded: function(touch, event) {
                  var target = event.getCurrentTarget()
                  var temp = touch.getLocation().x
                  if (temp - target.beginPox > pix) {
                        node.Move({
                              page: node.curIndex - 1
                        })
                  } else if (target.beginPox - temp > pix) {
                        node.Move({
                              page: node.curIndex + 1
                        })
                  } else {
                        for (var i = 0; i < node.items.length; i++) {
                              var current = node.items[i]
                              var locationInNode = current.convertToNodeSpace(touch.getLocation())
                              var s = current.getContentSize()
                              var rect = cc.rect(0, 0, s.width, s.height)
                              if (cc.rectContainsPoint(rect, locationInNode)) {
                                    if (node.curIndex == current.index) {
                                          if (fun) {
                                                fun(current.index)
                                          }
                                    } else {
                                          node.Move({
                                                page: current.index
                                          })
                                    }
                              }
                        }
                  }
            }
      })
      cc.eventManager.addListener(listener1, node)
      node.setCascadeOpacityEnabled(true)
      node.changeOP()
      return node
}

createPageView = func.createPageView


func.createChoseExp = function(data) {
      var files = data.files || []
      var fun = data.fun
      var devide = data.devide || 100
      var winX = cc.winSize.width
      var winY = cc.winSize.height
      var itemLen = winX - 2 * devide

      var node = new cc.Node()
      node.items = []
      var datainfo = [{
            scale: 1,
            posList: [cc.p(0, -40)]
      }, {
            scale: 0.8,
            posList: [cc.p(-220, -40), cc.p(252, -40)]
      }, {
            scale: 0.72,
            posList: [cc.p(-348, -30), cc.p(10, -30), cc.p(360, -30)]
      }, {
            scale: 0.6,
            posList: [cc.p(-204, 96), cc.p(197, 80),
                  cc.p(-204, -178), cc.p(197, -178)
            ]
      }, {
            scale: 0.6,
            posList: [cc.p(-272, 80), cc.p(272, 80),
                  cc.p(-272, -180), cc.p(272, -180), cc.p(1, -58)
            ]
      }, {
            scale: 0.6,
            posList: [cc.p(-333, 123), cc.p(4, 123), cc.p(342, 123),
                  cc.p(-333, -152), cc.p(4, -152), cc.p(342, -152)
            ]
      }]

      for (var i = 0; i < files.length; i++) {
            var back = new ccui.ImageView(res.img_exp_kuang)
            var item = new ccui.ImageView(files[i])
            var iteminfo = datainfo[files.length - 1]
            var exp = new ccui.ImageView(res[sprintf("img_exp%d", i + 1)])
            exp.setPosition(50, 360)
            item.setAnchorPoint(cc.p(-0.1, -0.08))
            item.setLocalZOrder(-1)
            back.addChild(item)
            back.addChild(exp)
            back.index = i
            back.setScale(iteminfo.scale)
            back.setPosition(winX / 2 + iteminfo.posList[i].x, winY / 2 + iteminfo.posList[i].y)
            createTouchEvent({
                  item: back,
                  begin: function(data) {
                        if (fun) {
                              fun(data.item.index)
                              return true
                        }
                        return false
                  }
            })
            node.addChild(back)
            node.items[i] = back
            back.setCascadeOpacityEnabled(true)
      }


      return node
}

createChoseExp = func.createChoseExp

func.getZq = function(data) { //创建蒸汽
      var pos = data.pos
      var father = data.father
      var devide = data.devide || 30
      var scale = data.scale || 1
      var node = new cc.Node()
      var data = [{
            name: "left",
            end: 11,
            pos: cc.p(-devide, 0)
      }, {
            name: "middle",
            end: 11,
            pos: cc.p(0, -10)
      }, {
            name: "right",
            end: 11,
            pos: cc.p(devide, 0)
      }, ]
      loadPlist("zq")
      for (var i = 0; i < data.length; i++) {
            var item = data[i]
            var sp = new cc.Sprite(sprintf("#zq_%s01.png", item.name))
            var ani = cc.repeatForever(createAnimation({
                  frame: sprintf("zq_%s%%02d.png", item.name),
                  end: item.end,
                  time: 0.15,
            }))
            sp.runAction(ani)
            sp.setPosition(item.pos)
            node.addChild(sp)
      }
      if (pos) {
            node.setPosition(pos)
      }
      if (father) {
            father.addChild(node)
      }
      node.setScale(scale)
      return node
}

getZq = func.getZq

func.createTool = function(data) { //创建工具箱
      var files = data.files //图片列表
      var pos = data.pos
      var tri = data.tri //方向
      var showTime = data.showTime || 0.3
      var moveTime = data.moveTime || 0.1
      var gets = data.gets || data.files
      var grays = data.grays || data.files
      var nums = data.nums //弹出个数
      var arrow = data.arrow || false //是否有箭头
      var modify = data.modify || cc.p(1, 1) //工具大小修正
      var itempos = data.itempos //工具位置修正
      itempos = judgeList({
            src: itempos,
            dest: cc.p(0, 0),
            nums: files.length,
      })
      var circlepos = data.circlepos || cc.p(0, 0)
      var devide = data.devide || cc.p(1, 1) //工具间距
      var scale = data.scale || 1 //整体缩放
      var swallow = data.swallow || []

      var father = data.father //图片拖出来后的父节点 必须
      var outfun = data.outfun //释放操作
      var clickfun = data.clickfun //拖出后的点击操作
      var firstClick = data.firstClick //第一次点击后操作
      var judgefun = data.judge //第一次点击前判断
      var backfun = data.backfun //拖回工具箱的判定操作
      var reTouch = data.reTouch //当已经取出并且没次数的时候重新点击的判定
      var beginfail = data.beginfail //失败回调
      var movefun = data.movefun //自定义移动
      var ifcircle = data.ifcircle || false
      var counts = data.counts //代表每个item能被取出的次数
      var myrect = data.myrect //触摸区域
      var circleScale = data.circleScale || 1
      var itemScale = data.itemScale
      itemScale = judgeList({
            src: itemScale,
            dest: 1,
            nums: files.length,
      })
      if (!counts) {
            counts = []
            for (var i = 0; i < files.length; i++) {
                  counts[i] = 1
            }
      }
      var judgeCounts = counts
      var btn = new ccui.ImageView(res.btn_gjx_normal)
      var btnsize = btn.getContentSize()
      btn.dataControl = {}
      var dataControl = btn.dataControl
      btn.setPosition(pos)
      if (nums < files.length) {
            arrow = true
      }
      var length = files.length
      var maxPage = Math.floor(length / nums) - (length % nums == 0 ? 1 : 0)
      dataControl.nums = nums
      dataControl.moveIndex = 0
      btn.inItem = function(index, item) {
            counts[index]--
                  var dataControl = this.dataControl
            if (!dataControl[sprintf("getItem%d", index)]) {
                  dataControl[sprintf("getItem%d", index)] = []
            }
            var list = dataControl[sprintf("getItem%d", index)]
            list[list.length] = item
      }
      btn.outItem = function(index, item) {
            var dataControl = this.dataControl
            var list = dataControl[sprintf("getItem%d", index)]
            if (!list) {
                  cc.log("some thing wrong, please check!!")
            } else {
                  for (var i = 0; i < list.length; i++) {
                        if (item == list[i]) {
                              list.splice(i, 1)
                              counts[index]++
                                    break
                        }
                  }
            }
            if (list.length == 0) {
                  dataControl[sprintf("getItem%d", index)] = null
            }
      }
      btn.judgeItem = function(index, item) {
            var dataControl = this.dataControl
            var list = dataControl[sprintf("getItem%d", index)]
            if (!list) {
                  return false
            } else {
                  for (var i = 0; i < list.length; i++) {
                        if (item == list[i]) {
                              return true
                        }
                  }
            }
            return false
      }
      btn.getindex = function(index) {
            var itemlist = dataControl[sprintf("getItem%d", index)]
            if (itemlist && counts[index] == 0) {
                  if (itemlist.length == 1) {
                        return itemlist[0]
                  }
            }
            return itemlist
      }
      btn.setAllUse = function(judge) {
            var btn = this
            judge = judge || false
            var listview = btn.listview
            if (listview && listview.changeAll) {
                  listview.changeAll(judge)
            }
      }
      var touchEvent = function(sender) {
            if (!dataControl.layout) {
                  var btn_size = sender.getContentSize()
                  var sp_arrow = new ccui.Button(res.btn_arrow_normal, res.btn_arrow_select)
                  var arrow_size = sp_arrow.getContentSize()
                  if (!arrow) {
                        arrow_size = cc.size(0, 0)
                  }
                  var circle = new cc.Sprite(res.img_circle_normal)
                  var circle_size = circle.getContentSize()
                  var width = (circle_size.width * devide.x * nums + arrow_size.width * 2) * modify.x
                  var height = (circle_size.height * devide.y) * modify.y
                  var beginwidth = circle_size.width * devide.x / 2
                  var beginheight = height / 2
                  var op = 0
                  var color = cc.color(255, 0, 0, 255)
                  var layout = new ccui.Layout()
                  if (scale) {
                        layout.setScale(scale)
                  }
                  var finalsize = null
                  var posmodify = null
                  var distance = null
                  var distanpar = 1.1
                  var layoutAnchor = null
                  var arrowModify = null
                  var circleStartPos = null
                  var circleMoveDis = null
                  var innerSize = null
                  var listPos = null
                  var judgeRect = null
                  var judgeTri = null
                  var aim = null
                  switch (tri) {
                        case "up":
                              finalsize = cc.size(height, width)
                              posmodify = cc.p(-finalsize.width * scale / 2 + btnsize.width / 2, btn_size.height)
                              distance = cc.p(0, -width * distanpar)
                              layoutAnchor = cc.p(0, 0)
                              arrowModify = {
                                    angle: [-90, 90], //下 上
                                    pos: [cc.p(0.5 * height, arrow_size.width / 2), cc.p(0.5 * height, width - arrow_size.width / 2)]
                              }
                              circleStartPos = cc.p(beginheight, beginwidth)
                              circleMoveDis = cc.p(0, circle_size.width * devide.x)
                              innerSize = cc.size(circle_size.width * devide.y * modify.y, nums * circle_size.height * devide.x * modify.x)
                              judgeRect = cc.size(innerSize.width, innerSize.height / nums)
                              listPos = cc.p(0, arrow_size.width)
                              judgeTri = "H"
                              aim = 90
                              break
                        case "down":
                              finalsize = cc.size(height, width)
                              posmodify = cc.p(-finalsize.width * scale / 2 + btnsize.width / 2, 0)
                              distance = cc.p(0, width * distanpar)
                              layoutAnchor = cc.p(0, 1)
                              arrowModify = {
                                    angle: [-90, 90], //下 上
                                    pos: [cc.p(0.5 * height, arrow_size.width / 2), cc.p(0.5 * height, width - arrow_size.width / 2)]
                              }
                              circleStartPos = cc.p(beginheight, beginwidth + (nums - 1) * circle_size.width * devide.x)
                              circleMoveDis = cc.p(0, -circle_size.width * devide.x)
                              innerSize = cc.size(circle_size.width * devide.y * modify.y, nums * circle_size.height * devide.x * modify.x)
                              listPos = cc.p(0, arrow_size.width)
                              judgeRect = cc.size(innerSize.width, innerSize.height / nums)
                              judgeTri = "H"
                              aim = 90
                              break
                        case "left":
                              finalsize = cc.size(width, height)
                              posmodify = cc.p(0, -finalsize.height * scale / 2 + btnsize.height / 2)
                              distance = cc.p(width * distanpar, 0)
                              layoutAnchor = cc.p(1, 0)
                              arrowModify = {
                                    angle: [0, 180], //左 右
                                    pos: [cc.p(arrow_size.width / 2, 0.5 * height), cc.p(width - arrow_size.width / 2, 0.5 * height)]
                              }
                              innerSize = cc.size(nums * circle_size.width * devide.x * modify.x, circle_size.height * devide.y * modify.y)
                              circleStartPos = cc.p(beginwidth + (nums - 1) * circle_size.width * devide.x, beginheight)
                              circleMoveDis = cc.p(-circle_size.width * devide.x, 0)
                              listPos = cc.p(arrow_size.width, 0)
                              judgeRect = cc.size(innerSize.width / nums, innerSize.height)
                              judgeTri = "W"
                              aim = 0
                              break
                        case "right":
                              finalsize = cc.size(width, height)
                              posmodify = cc.p(btn_size.width, -finalsize.height * scale / 2 + btnsize.height / 2)
                              distance = cc.p(-width * distanpar, 0)
                              layoutAnchor = cc.p(0, 0)
                              arrowModify = {
                                    angle: [0, 180], //左 右
                                    pos: [cc.p(arrow_size.width / 2, 0.5 * height), cc.p(width - arrow_size.width / 2, 0.5 * height)]
                              }
                              circleStartPos = cc.p(beginwidth, beginheight)
                              circleMoveDis = cc.p(circle_size.width * devide.x, 0)
                              innerSize = cc.size(nums * circle_size.width * devide.x * modify.x, circle_size.height * devide.y * modify.y)
                              listPos = cc.p(arrow_size.width, 0)
                              judgeRect = cc.size(innerSize.width / nums, innerSize.height)
                              judgeTri = "W"
                              aim = 0
                              break
                        default:
                              cc.log("Error! no tri in data")
                              break
                  }
                  dataControl.circleMoveDis = circleMoveDis
                  layout.setBackGroundColor(color)
                  layout.setBackGroundColorOpacity(op)
                  layout.setContentSize(finalsize) //resize
                  layout.setPosition(posmodify)
                  layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID)
                  layout.setTouchEnabled(true)
                  layout.setSwallowTouches(false)
                  layout.setClippingEnabled(true)
                  layout.setAnchorPoint(layoutAnchor)

                  dataControl.toolbg = new cc.Scale9Sprite(res.bg_gjx, cc.rect(0, 0, 93, 80), cc.rect(20, 60, 60, 10))
                  var bg = dataControl.toolbg

                  bg.setContentSize(finalsize)
                  bg.setAnchorPoint(cc.p(0, 0))

                  bg.setPosition(distance) //recode
                  dataControl.moveModify = distance



                  if (arrowModify && arrow) {
                        for (var i = 0; i < 2; i++) {
                              var sp_arrow = new ccui.Button(res.btn_arrow_normal, res.btn_arrow_select)
                              sp_arrow.setRotation(arrowModify.angle[i])
                              sp_arrow.setPosition(arrowModify.pos[i])
                              switch (tri) {
                                    case "up":
                                    case "down":
                                          sp_arrow.tri = i == 0 ? -1 : 1
                                          break
                                    case "right":
                                    case "left":
                                          sp_arrow.tri = i == 0 ? 1 : -1
                                          break
                              }

                              if (!dataControl.arrow) {
                                    dataControl.arrow = []
                              }
                              dataControl.arrow[i] = sp_arrow
                              bg.addChild(sp_arrow)

                              sp_arrow.addClickEventListener(function() {
                                    var arrow = this
                                    if (dataControl.listview) {
                                          dataControl.listview.move(arrow.tri)
                                    }
                              })
                        }
                  }
                  if (!dataControl.listview) {
                        dataControl.listview = createLayout({
                              pos: listPos,
                              size: innerSize,
                              op: 0,
                        })
                        var listview = dataControl.listview
                        listview.setClippingEnabled(true)
                        listview.judgeTri = judgeTri
                        for (var i = 0; i < files.length; i++) {
                              var item = new ccui.ImageView(files[i])
                              var circle = new ccui.ImageView(res.img_circle_normal)
                              var tempPos = itempos[i] || cc.p(0, 0)
                              item.setPosition(cc.p(circleStartPos.x + tempPos.x, circleStartPos.y + tempPos.y))
                              circle.setPosition(cc.p(circleStartPos.x + circlepos.x, circleStartPos.y + circlepos.y))
                              circleStartPos = cc.p(circleStartPos.x + circleMoveDis.x, circleStartPos.y + circleMoveDis.y)
                              listview.addChild(circle)
                              listview.addChild(item)
                              circle.setScale(circleScale)
                              var tempScale = itemScale[i] || 1
                              item.setScale(tempScale)
                              if (!ifcircle) {
                                    circle.setVisible(false)
                              }
                              if (!listview.itemArr) {
                                    listview.itemArr = []
                              }
                              listview.itemArr[i] = {
                                    item: item,
                                    circle: circle
                              }
                        }
                        listview.move = function(tri) {
                              var listview = this
                              var judge = listview.curPage - tri
                              if (!dataControl.Arrowing && listview.itemArr && arrow && judge >= 0 && judge <= maxPage) {
                                    listview.curPage = judge
                                    dataControl.Arrowing = true
                                    var arr = listview.itemArr
                                    var movecount = 0
                                    for (var i = 0; i < arr.length; i++) {
                                          var item = arr[i]
                                          var movepos = cc.p(dataControl.circleMoveDis.x * dataControl.nums * tri,
                                                dataControl.circleMoveDis.y * dataControl.nums * tri)
                                          movecount = movecount + 1
                                          var fun = function() {
                                                movecount = movecount - 1
                                                if (movecount == 0) {
                                                      dataControl.listview.judgeArrow(function() {
                                                            addTimer({
                                                                  fun: function() {
                                                                        dataControl.moveIndex = dataControl.moveIndex - dataControl.nums * tri
                                                                        dataControl.Arrowing = false
                                                                        removeTimer("ARROWING")
                                                                  },
                                                                  time: 0.05,
                                                                  key: "ARROWING",
                                                                  delay: 0.05,
                                                            })
                                                      })
                                                }
                                          }
                                          addShowType({
                                                item: item.item,
                                                show: "moveBy",
                                                time: moveTime,
                                                buf: movepos,
                                                fun: fun
                                          })
                                          addShowType({
                                                item: item.circle,
                                                show: "moveBy",
                                                time: moveTime,
                                                buf: movepos,
                                                fun: fun
                                          })
                                    }
                              }
                        }
                        listview.judgeArrow = function(fun) {
                              var first = false
                              var second = false
                              if (arrowModify && arrow) {
                                    if (this.itemArr) {
                                          var itembegin = this.itemArr[0].item
                                          var itemend = this.itemArr[this.itemArr.length - 1].item
                                          switch (tri) {
                                                case "up":
                                                case "down":
                                                      first = listview.curPage == 0
                                                      second = listview.curPage == maxPage
                                                      break
                                                case "right":
                                                case "left":
                                                      second = listview.curPage == 0
                                                      first = listview.curPage == maxPage
                                                      break
                                          }
                                    }
                              } else {
                                    first = false
                                    second = false
                              }
                              if (dataControl.arrow) {
                                    dataControl.arrow[0].setVisible(!second)
                                    dataControl.arrow[1].setVisible(!first)
                              }
                              if (fun) {
                                    fun()
                              }
                        }
                        listview.changeAll = function(judge) {
                              var view = this
                              judge = judge || false
                              view.disTouch = !judge
                              for (var i = 0; i < view.itemArr.length; i++) {
                                    if (counts[i] == 0) {
                                          listview.changeView(i, true)
                                    } else {
                                          if (!judge) {
                                                listview.changeView(i, true)
                                          } else {
                                                listview.changeView(i, false)
                                          }
                                    }
                              }
                        }
                        listview.changeView = function(index, ifgray) {
                              if (this.itemArr) {
                                    if (this.itemArr[index]) {
                                          var item = this.itemArr[index]
                                          var color = null
                                          if (!ifgray) {
                                                item.circle.loadTexture(res.img_circle_normal)
                                                item.item.loadTexture(files[index])
                                                item.item.setOpacity(255)
                                          } else {
                                                item.circle.loadTexture(res.img_circle_select)
                                                item.item.loadTexture(grays[index])
                                                if (grays[index] == files[index]) {
                                                      item.item.setOpacity(127)
                                                }
                                          }
                                    }
                              }
                        }
                        listview.curPage = 0
                        listview.judgeArrow()
                        var judgeBack = function(touch, item) {
                              var locationInNode = listview.convertToNodeSpace(touch)
                              var s = listview.getContentSize()
                              var rect = cc.rect(0, 0, s.width, s.height)
                              if (cc.rectContainsPoint(rect, locationInNode) && dataControl.showing) {
                                    if (!(btn.judgeItem(item.index, item))) {
                                          cc.log("something wrong......please check")
                                    } else {
                                          if (backfun) {
                                                var temp_judge = backfun({
                                                      sp: item,
                                                      index: item.index,
                                                      pos: touch
                                                })
                                                if (temp_judge == "back") {
                                                      item.forceBack(false)
                                                      return
                                                }
                                                if (!temp_judge) {
                                                      return
                                                }
                                          }
                                          btn.outItem(item.index, item)
                                          listview.changeView(item.index, false)
                                          item.removeFromParent(true)
                                    }
                              } else {
                                    if (outfun) {
                                          outfun({
                                                sp: item,
                                                index: item.index,
                                                pos: touch
                                          })
                                    }
                              }
                        }
                        createMoveRotate({
                              item: listview,
                              aim: aim,
                        })
                        var getSp = function(data) {
                              var pos = data.pos
                              var final = data.final || pos
                              var locationInNode = listview.convertToNodeSpace(pos)
                              var s = listview.getContentSize()
                              var rect = cc.rect(0, 0, s.width, s.height)
                              var targetIndex = null
                              if (cc.rectContainsPoint(rect, locationInNode)) {
                                    switch (tri) {
                                          case "up":
                                                targetIndex = Math.floor(locationInNode.y / judgeRect.height) + dataControl.moveIndex
                                                break
                                          case "down":
                                                targetIndex = (nums - 1 - Math.floor(locationInNode.y / judgeRect.height) + dataControl.moveIndex)
                                                break
                                          case "right":
                                                targetIndex = Math.floor(locationInNode.x / judgeRect.width) + dataControl.moveIndex
                                                break
                                          case "left":
                                                targetIndex = nums - 1 - Math.floor(locationInNode.x / judgeRect.width) + dataControl.moveIndex
                                                break
                                    }
                                    if (judgefun) {
                                          if (!judgefun(targetIndex)) {
                                                return false
                                          }
                                    }
                                    if (father) {
                                          //cc.log(counts, targetIndex)
                                          if (counts[targetIndex] > 0) { //此处获取图片
                                                var temp = null
                                                var noget = false
                                                if (!gets[targetIndex]) {
                                                      if (firstClick) {
                                                            noget = true
                                                            temp = firstClick({
                                                                  index: targetIndex,
                                                                  pos: pos,
                                                                  sp: null,
                                                            })
                                                      }
                                                } else {
                                                      temp = new cc.Sprite(gets[targetIndex])
                                                }
                                                if (!temp) {
                                                      return false
                                                }
                                                temp.forceBack = function(judge) {
                                                      btn.outItem(this.index, this)
                                                      listview.changeView(this.index, false)
                                                      if (judge != null) {
                                                            this.setVisible(judge)
                                                      } else {
                                                            this.removeFromParent(true)
                                                      }
                                                }
                                                temp.disMove = function(judge) {
                                                      this.noMove = judge
                                                }
                                                temp.disMove(false)
                                                temp.index = targetIndex
                                                if (firstClick && !noget) {
                                                      if (!firstClick({
                                                                  sp: temp,
                                                                  index: temp.index,
                                                                  pos: pos
                                                            })) {
                                                            return false
                                                      }
                                                }
                                                if (!temp.nopos) { //自定义创建位置
                                                      temp.setPosition(father.convertToNodeSpace(final))
                                                }
                                                if (!temp.getParent()) {
                                                      father.addChild(temp)
                                                }
                                                btn.inItem(targetIndex, temp)
                                                dataControl.canItemMove = true
                                                dataControl.curMoveItem = temp
                                                      //turn gray
                                                if (counts[targetIndex] == 0) {
                                                      listview.changeView(targetIndex, true)
                                                }
                                                var tempSwallow = true
                                                if (swallow[targetIndex] != null) {
                                                      tempSwallow = swallow[targetIndex]
                                                }
                                                createTouchEvent({
                                                      item: temp,
                                                      swallow: tempSwallow,
                                                      rect: myrect,
                                                      beginfail: function(data) {
                                                            if (beginfail) {
                                                                  return beginfail({
                                                                        sp: data.item,
                                                                        pos: data.pos,
                                                                        index: data.item.index,
                                                                  })
                                                            }
                                                            return false
                                                      },
                                                      begin: function(data) {
                                                            var target = data.item
                                                            var pos = data.pos
                                                            if (clickfun) {
                                                                  return clickfun({
                                                                        sp: target,
                                                                        index: target.index,
                                                                        pos: pos,
                                                                  })
                                                            } else {
                                                                  return true
                                                            }
                                                      },
                                                      move: function(data) {
                                                            var target = data.item
                                                            var pos = data.pos
                                                            var delta = data.delta
                                                            if (!target.noMove) {
                                                                  if (movefun) {
                                                                        movefun({
                                                                              sp: target,
                                                                              pos: pos,
                                                                              delta: delta,
                                                                              index: target.index,
                                                                        })
                                                                  } else {
                                                                        target.x += delta.x
                                                                        target.y += delta.y
                                                                  }
                                                            }
                                                      },
                                                      end: function(data) {
                                                            var item = data.item
                                                            var pos = data.pos
                                                            judgeBack(pos, item)
                                                      }
                                                })
                                          } else {
                                                if (reTouch) {
                                                      dataControl.curMoveItem = reTouch({
                                                            pos: pos,
                                                            index: targetIndex,
                                                            sp: btn.getindex(targetIndex),
                                                      })
                                                } else {
                                                      dataControl.canItemMove = false
                                                }
                                          }
                                    } else {
                                          dataControl.canItemMove = false
                                    }
                                    return dataControl.curMoveItem
                              }
                              return null
                        }
                        createTouchEvent({
                              item: listview,
                              begin: function(data) {
                                    var item = data.item
                                    var pos = data.pos
                                    if (listview.disTouch) {
                                          return false
                                    }
                                    if (!dataControl.Arrowing && !dataControl.Moving && dataControl.showing) {
                                          item.listenRotate(pos)
                                          if (!arrow) {
                                                var sp = getSp({
                                                      pos: item.startPos,
                                                      final: pos,
                                                })
                                                item.select = sp
                                          }
                                          return true
                                    }
                                    return false
                              },
                              move: function(data) {
                                    var target = data.item
                                    var pos = data.pos
                                    var delta = data.delta
                                    var tri = target.getAngle(pos)
                                    var dis = target.getDis(pos)
                                    var mix = 20
                                    if (dataControl.canItemMove && dataControl.curMoveItem && target.select) {
                                          var item = target.select
                                          if (movefun) {
                                                movefun({
                                                      sp: item,
                                                      pos: pos,
                                                      delta: delta,
                                                      index: item.index,
                                                })
                                          } else {
                                                item.x += delta.x / getLoopScale(item)
                                                item.y += delta.y / getLoopScale(item)
                                          }
                                    }

                                    if (!target.judge) {
                                          if (dis >= mix && (tri == "down" || tri == "up")) {
                                                target.judge = true
                                                if (!target.select) {
                                                      sp = getSp({
                                                            pos: target.startPos,
                                                            final: pos,
                                                      })
                                                      target.select = sp
                                                }
                                          }
                                          if (dis >= mix && (tri == "left" || tri == "right")) {
                                                target.judge = true
                                                target.tri = tri
                                          }
                                    } else {
                                          if (!target.select && !target.tri) {
                                                sp = getSp({
                                                      pos: target.startPos,
                                                      final: pos,
                                                })
                                                target.select = sp
                                          }
                                    }
                              },
                              end: function(data) {
                                    var pos = data.pos
                                    var item = data.item
                                    if (item.select && dataControl.canItemMove && dataControl.curMoveItem) {
                                          judgeBack(pos, dataControl.curMoveItem)
                                          item.select = null
                                    } else {
                                          var tempJudge = 1
                                          if (tri == "down" || tri == "up") {
                                                tempJudge = -1
                                          }
                                          switch (item.tri) {
                                                case "left":
                                                      item.move(-1 * tempJudge)
                                                      break
                                                case "right":
                                                      item.move(1 * tempJudge)
                                                      break
                                          }
                                    }
                              }
                        })
                        bg.addChild(listview)
                        btn.listview = listview
                        listview.curPage = 0
                  }

                  layout.addChild(bg)
                  sender.addChild(layout)
                  dataControl.layout = layout
            }
            if (!dataControl.Moving) {
                  dataControl.Moving = true
                  if (!dataControl.showing) {
                        btn.loadTexture(res.btn_gjx_select)
                        addShowType({
                              item: dataControl.toolbg,
                              show: "moveTo",
                              time: showTime,
                              buf: cc.p(0, 0),
                              fun: function() {
                                    dataControl.Moving = false
                                    dataControl.showing = true
                              }
                        })
                  } else {
                        btn.loadTexture(res.btn_gjx_normal)
                        addShowType({
                              item: dataControl.toolbg,
                              show: "moveTo",
                              time: showTime,
                              buf: dataControl.moveModify,
                              fun: function() {
                                    dataControl.Moving = false
                                    dataControl.showing = false
                              }
                        })
                  }
            }
      }
      btn.show = function() {
            touchEvent(this)
      }
      btn.getStatus = function() {
            return this.dataControl.showing
      }
      createTouchEvent({
                  item: btn,
                  end: function(data) {
                        var item = data.item
                        touchEvent(item)
                  }
            })
            //btn.setSelected(true)
      return btn
}

createTool = func.createTool

func.pauseMusic = function() {
      cc.audioEngine.pauseMusic()
}

pauseMusic = func.pauseMusic

func.resumeMusic = function() {
      cc.audioEngine.resumeMusic()
}

resumeMusic = func.resumeMusic

func.playMusic = function(file, loop) {
      loop = loop || false
      if (file) {
            finishTimer("SAYING") //先这么处理吧
            cc.audioEngine.stopMusic()
            cc.audioEngine.playMusic(file, loop)
            cc.audioEngine.setFile(file)
      }
}
playMusic = func.playMusic

func.playEffect = function(file, loop) {
      loop = loop || false
      if (file) {
            cc.audioEngine.playEffect(file, loop)
      }
}
playEffect = func.playEffect

func.stopEffect = function() {
      cc.audioEngine.stopAllEffects()
}
stopEffect = func.stopEffect


func.judgeMusic = function(file) {
      return cc.audioEngine.musicEnd(file)
}

judgeMusic = func.judgeMusic

func.stopMusic = function(file) {
      if (file) {
            if (cc.audioEngine.getFile() == file) {
                  cc.audioEngine.stopMusic()
            }
      } else {
            cc.audioEngine.stopMusic()
      }
}

stopMusic = func.stopMusic

func.createTouchRect = function(data) //创建监听判定区域 实验用
      {
            var size = data.size || cc.size(0, 0)
            var pos = data.pos || cc.p(0, 0)
            var op = data.op || 0
            var color = data.color || cc.color(255, 0, 0, 255)
            var touchNode = new ccui.Layout()
            touchNode.setBackGroundColor(color)
            touchNode.setContentSize(size)
            touchNode.setPosition(pos)
            touchNode.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID)
            touchNode.setBackGroundColorOpacity(op)
            touchNode.setTouchEnabled(true)
            touchNode.setSwallowTouches(false)
            return touchNode
      }

createTouchRect = func.createTouchRect

func.createResult = function(data) { //创建结论
      var img = data.img
      var anchor = cc.p(0.5, 0.5)
      var size = cc.size(587, 377)
      var offset = data.offset || cc.p(15, 10)
      var offx = 0.1
      var offy = 0.1
      var offbg = data.offbg || cc.p(0, 0)
      var btnfun = data.btnfun
      var result = new cc.Scale9Sprite(res.bg_result,
            cc.rect(0, 0, size.width, size.height),
            cc.rect(offx * size.width, offy * size.height,
                  (1 - offx) * size.width, (1 - offy) * size.height))
      if (img) {
            if (!result.content) {
                  result.content = new cc.Sprite(img)
                  result.content.setAnchorPoint(0, 0)
                  result.content.setPosition(offset)
                  result.addChild(result.content)
            }
            result.width = result.content.getContentSize().width * 1.1 + offbg.x
            result.height = result.content.getContentSize().height * 1.1 + offbg.y
            if (!result.closeBtn) {
                  result.closeBtn = new ccui.Button(res.btn_result_quit_normal, res.btn_result_quit_select)
                  result.closeBtn.setAnchorPoint(1, 0)
                  result.addChild(result.closeBtn)
                  result.closeBtn.addClickEventListener(function() {
                        if (result.people && result.people.stopSay) {
                              result.people.stopSay()
                        }
                        if (btnfun)
                              btnfun()
                  })
            }
            var btnModify = 10
            result.closeBtn.setPosition(result.width - btnModify, result.height - result.closeBtn.getContentSize().height - btnModify)
      }
      result.setAnchorPoint(anchor)
      return result
}

createResult = func.createResult

func.createDialog = function(data) { //创建对话
      var size = data.size || cc.size(1, 1)
      var pos = data.pos
      var key = data.key
      var img = data.img
      var btnoffset = data.btnoffset || cc.p(0, 0)
      var scale = data.scale || 1
      var anchor = data.anchor
      var offset = data.offset || cc.p(0, 0)
      var backType = data.backType || 1
      var result = new cc.Scale9Sprite(res.img_dialog, cc.rect(0, 0, 200, 95), cc.rect(50, 20, 100, 10))
      result.modify = function(final, scale) {
            if (!this.content) {
                  this.content = new cc.Sprite(final)
                  this.content.setAnchorPoint(-0.03, -0.05)
                  this.content.setScale(scale)
                  result.addChild(this.content)
            } else {
                  var temp = getSize(final)
                  this.content.setTexture(cc.textureCache.addImage(final))
                  this.content.setScale(scale)
                  this.content.setTextureRect(cc.rect(0, 0, temp.width, temp.height))
            }
            result.width = this.content.getContentSize().width * 1.1 * this.content.getScaleX()
            result.height = this.content.getContentSize().height * 1.1 * this.content.getScaleY()
            if (result.height < 95) {
                  result.height = 95
            }
            this.content.setPosition(offset)
            if (!this.closeBtn) {
                  this.closeBtn = new ccui.Button(res.btn_tipclose_normal, res.btn_tipclose_select)
                  this.closeBtn.setAnchorPoint(0, 0)
                  this.closeBtn.setScale(0.8)
                  result.addChild(this.closeBtn)
                  this.closeBtn.addClickEventListener(function() {
                        if (result.getParent().stopSay) {
                              result.getParent().stopSay()
                        }
                  })
            }
            var btnModify = 0
            this.closeBtn.setPosition(btnModify + 10 + btnoffset.x, result.height - this.closeBtn.getContentSize().height - btnModify + btnoffset.y)
      }
      if (img) {
            result.modify(img, scale)
      } else {
            result.width = size.width
            result.height = size.height
      }
      if (pos) {
            result.setPosition(pos)
      }
      if (anchor) {
            result.setAnchorPoint(anchor)
      }

      return result
}

createDialog = func.createDialog

func.init = function() { //初始化
      func.loadPlist("boshisay")
      func.loadPlist("boshishow")
      func.loadPlist("studentsay")
      func.loadPlist("studentshow")
      func.aniData = {
            boshisay: {
                  start: 1,
                  end: 8,
                  frame: "boshisay%02d.png",
                  time: 0.05,
                  origin: true
            },
            boshishow: {
                  start: 1,
                  end: 35,
                  frame: "boshishow%02d.png",
                  time: 0.05
            },
            studentsay: {
                  start: 1,
                  end: 10,
                  frame: "studentsay%02d.png",
                  time: 0.05,
                  origin: true
            },
            studentshow: {
                  start: 1,
                  end: 48,
                  frame: "studentshow%02d.png",
                  time: 0.05
            },
      }
      func.myInit = true
}

func.addPeople = function(data) //添加博士或者学生
      {
            var id = data.id //boshi  student
            var pos = data.pos || cc.p(0, 0) //创建的位置
            var result = null
            var frame = null
            var say = null
            var show = null
            if (!func.myInit) {
                  func.init()
            }
            switch (id) {
                  case "boshi":
                        frame = "boshisay01.png"
                        say = "boshisay"
                        show = "boshishow"
                        break
                  case "student":
                        frame = "studentshow15.png"
                        say = "studentsay"
                        show = "studentshow"
                        break
                  default:
                        cc.log("wrong id was call in addPeople", data)
                        break
            }
            if (frame) {
                  result = new cc.Sprite()
                  result.retain()
                  result.ending = false
                  result.originFrame = frame
                  result.aniSay = function() {
                        return createAnimation(func.aniData[say])
                  }
                  result.aniShow = function() {
                        return createAnimation(func.aniData[show])
                  }
                  result.show = function(fun) {
                        result.runAction(cc.sequence(result.aniShow(), cc.callFunc(function() {
                              result.stopAllActions()
                              result.setSpriteFrame(result.originFrame)
                              if (fun) {
                                    fun()
                              }
                        })))
                  }
                  result.finish = function() {
                        result.ending = true
                  }
                  result.stopSay = function(immediate) {
                        immediate = immediate || false
                        result.saying = false
                        stopMusic()
                              //pauseMusic()
                        removeTimer("SAYING")
                        result.stopAllActions()
                        result.setSpriteFrame(result.originFrame)
                        var removelisten = false
                        if (result.curdata) {
                              var dialog = null
                              switch (result.dialogList[result.curdata.key].id) {
                                    case "normal":
                                          dialog = result.DialogImg
                                          break
                                    case "result":
                                          dialog = result.ResultDialog
                                          removelisten = true
                                          break
                              }
                              if (removelisten) {
                                    if (dialog.removeListen) {
                                          dialog.removeListen()
                                    }
                                    if (dialog.listener) {
                                          cc.eventManager.removeListener(dialog.listener)
                                          dialog.listener = null
                                    }
                              }
                              if (immediate) {
                                    dialog.setVisible(false)
                                    dialog.setScale(0)
                                    dialog.setVisible(true)
                              } else {
                                    addShowType({
                                          item: dialog,
                                          show: "zoom",
                                          time: 0.3,
                                    })
                              }
                        }
                  }
                  result.say = function(saydata) {
                        var key = saydata.key
                        var fun = saydata.fun
                        var force = saydata.force || false
                        if (result.saying) {
                              if (!force) {
                                    if (result.pastKey != "result" && result.dialogList[key].id == "result") {
                                          result.stopSay(true)
                                    } else {
                                          result.stopSay(false)
                                          return
                                    }
                              } else {
                                    result.stopSay(true)
                              }
                              // var indata = result.dialogList[key]
                              // if (indata && indata.id == "result") {
                              //       return
                              // }
                        } else {
                              // if (indata && indata.id == "result") {
                              //       result.stopAllActions()
                              // }
                        }
                        if (result.dialogList[key]) {
                              var indata = result.dialogList[key]
                              var needstop = true
                              switch (indata.id) {
                                    case "normal":
                                          if (result.ResultDialog) {
                                                result.ResultDialog.setVisible(false)
                                          }
                                          if (!result.DialogImg) {
                                                result.DialogImg = createDialog({
                                                      anchor: cc.p(1.0, 0.5),
                                                      offset: indata.offset,
                                                      btnoffset: indata.btnoffset,
                                                      backType: indata.backType,
                                                })
                                                result.DialogImg.setVisible(false)
                                                var tempSp = new cc.Sprite("#" + result.originFrame)
                                                result.DialogImg.setPosition(cc.p(tempSp.getContentSize().width / 2 - 20, tempSp.getContentSize().height / 2))
                                                result.addChild(result.DialogImg)
                                          }
                                          if (indata.img) {
                                                result.DialogImg.modify(indata.img, indata.scale)
                                                result.DialogImg.setScale(0)
                                                result.DialogImg.stopAllActions()
                                                addShowType({
                                                      item: result.DialogImg,
                                                      show: "scale",
                                                      time: 0.3,
                                                      offset: indata.offset,
                                                })
                                                result.DialogImg.setVisible(true)
                                          } else {
                                                result.DialogImg.setVisible(false)
                                          }
                                          break
                                    case "result":
                                          if (result.DialogImg) {
                                                result.DialogImg.setVisible(false)
                                          }
                                          var par = indata.father || result.getParent()

                                          if (!result.ResultDialog) {
                                                result.ResultDialog = createResult({
                                                      img: indata.img,
                                                      offset: indata.offset,
                                                      offbg: indata.offbg,
                                                })
                                                result.ResultDialog.setVisible(false)
                                                result.ResultDialog.people = result
                                                result.ResultDialog.setLocalZOrder(LOCAL_ORDER++)
                                                safeAdd(par, result.ResultDialog)
                                                result.ResultDialog.setScale(0)
                                          }
                                          var location = par.convertToNodeSpace(cc.p(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2))
                                          result.ResultDialog.setPosition(location)
                                          result.ResultDialog.setVisible(true)
                                                //给对话框单击移动是设置层级关系 -todo gsr
                                                //全局变量LOCAL_ORDER
                                          result.ResultDialog.changeSelfLocalZero = function() {
                                                this.setLocalZOrder(LOCAL_ORDER++)
                                                safeAdd(this.getParent(), this)
                                          }
                                          result.ResultDialog.setLocalZOrder(LOCAL_ORDER++)
                                          safeAdd(result.ResultDialog.getParent(), result.ResultDialog)
                                          createTouchEvent({
                                                item: result.ResultDialog,
                                                autoMove: true,
                                                begin: function(data) {
                                                      var item = data.item
                                                      item.setLocalZOrder(LOCAL_ORDER++)
                                                      safeAdd(item.getParent(), item)
                                                      return true
                                                },
                                          })
                                          result.ResultDialog.setScale(0)
                                          result.ResultDialog.stopAllActions()
                                          addShowType({
                                                item: result.ResultDialog,
                                                show: "scale",
                                                time: 0.3
                                          })
                                          needstop = false
                                          break
                              }
                              result.pastKey = indata.id
                              result.stopAllActions()
                              if (indata.sound) {
                                    result.runAction(cc.repeatForever(result.aniSay()))
                                    playMusic(indata.sound)
                                    addTimer({
                                          time: 0.1,
                                          repeat: cc.REPEAT_FOREVER,
                                          fun: function() {
                                                if (judgeMusic(indata.sound)) {
                                                      if (needstop) {
                                                            result.stopSay()
                                                      } else {
                                                            result.saying = false
                                                            stopMusic()
                                                            removeTimer("SAYING")
                                                            result.stopAllActions()
                                                            result.setSpriteFrame(result.originFrame)
                                                      }
                                                      if (fun) {
                                                            fun()
                                                      }
                                                }
                                          },
                                          finish: function() {
                                                if (needstop) {
                                                      result.stopSay()
                                                } else {
                                                      result.saying = false
                                                      stopMusic()
                                                      result.stopAllActions()
                                                      result.setSpriteFrame(result.originFrame)
                                                }
                                                if (fun) {
                                                      fun()
                                                }
                                          },
                                          key: "SAYING",
                                    })
                              }
                              result.saying = true
                              result.curdata = saydata
                        }
                  }

                  var listener1 = cc.EventListener.create({
                              event: cc.EventListener.TOUCH_ONE_BY_ONE,
                              swallowTouches: true,
                              onTouchBegan: function(touch, event) {
                                    var locationInNode = result.convertToNodeSpace(touch.getLocation())
                                    var s = result.getContentSize()
                                    var rect = cc.rect(s.width / 3, 0, s.width / 2, s.height)
                                    if (cc.rectContainsPoint(rect, locationInNode)) {
                                          return true;
                                    }
                                    return false;
                              },
                              onTouchEnded: function(touch, event) {
                                    if (result.ending) {
                                          return
                                    }
                                    if (!result.saying) {
                                          if (result.curdata) {
                                                result.say(result.curdata)
                                          }
                                    }
                              }
                        })
                        //cc.eventManager.addListener(listener1, result)//小孩说话开关
                  result.setPosition(pos)
            }
            return result
      }

addPeople = func.addPeople

func.addContent = function(data) //添加对话
      {
            if (!func.myInit) {
                  func.init()
            }
            var img = data.img //对话文字图片
            var sound = data.sound //对话声音文件
            var key = data.key //对话标签 自定义
            var people = data.people //对话人物  传入上文创建的人物
            var scale = data.scale || 1 //对话文字图片缩放值
            var offbg = data.offbg || cc.p(0, 0) //结论框修正
            var id = data.id || "normal" //对话ID 普通为normal 现象结论为result
            var offset = data.offset
            var btnoffset = data.btnoffset
            var backType = data.backType || 1
            var father = data.father
            if (!people.dialogList) {
                  people.dialogList = {}
            }
            people.dialogList[key] = {
                  img: img,
                  sound: sound,
                  id: id,
                  btnoffset: btnoffset,
                  offset: offset,
                  scale: scale,
                  offbg: offbg,
                  backType: backType,
                  father: father,
            }
      }

addContent = func.addContent
      //通用函数
func.loadPlist = function(name, imgname)
      //加载plist 未传入图片上时只能加载csv中定义为plist类型的文件
      {
            imgname = imgname || name + 'img'
            var png = res[imgname]
            var plist = res[name]
            cc.spriteFrameCache.addSpriteFrames(plist, png)
      }

loadPlist = func.loadPlist

func.createAnimation = function(data) //创建动画 
      {
            var frame = data.frame //序列帧字符串
            var start = data.start || 1 //起始帧
            var end = data.end //结束帧
            var time = data.time || 0.1 //帧间隔
            var devide = data.devide || 1 //取帧间隔 默认为1
            var origin = data.origin //播放后是否保留最后一帧？ 似乎没什么用
            var rever = data.rever || false //是否反向
            var animation = new cc.Animation()
            if (rever) {
                  for (var i = end; i >= start; i -= devide) {
                        var frameName = sprintf(frame, i)
                        animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(frameName))
                  }
            } else {
                  for (var i = start; i <= end; i += devide) {
                        var frameName = sprintf(frame, i)
                        animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(frameName))
                  }
            }

            animation.setDelayPerUnit(time);
            if (origin) {
                  animation.setRestoreOriginalFrame(true)
            }
            var action = new cc.Animate(animation)
                  //action.retain()
                  //action.doretain = true
            return action
      }

createAnimation = func.createAnimation

var TAG_COVER = 998

func.addCover = function() {
      //添加屏蔽层
      var temp = new ccui.Layout()
      temp.setContentSize(cc.director.getWinSize())
      temp.setAnchorPoint(0, 0)
      temp.setPosition(0, 0)
      temp.setTouchEnabled(true)
      temp.setSwallowTouches(true)
      temp.setTag(TAG_COVER)
      var scene = cc.director.getRunningScene()
      if (scene.getChildByTag(TAG_COVER)) {
            scene.removeChildByTag(TAG_COVER)
      }
      cc.director.getRunningScene().addChild(temp, 999)
}
addCover = func.addCover

func.removeCover = function() {
      //删除屏蔽层
      var scene = cc.director.getRunningScene()
      if (scene.getChildByTag(TAG_COVER)) {
            scene.removeChildByTag(TAG_COVER)
      }
}

removeCover = func.removeCover

func.changeLayer = function(data) //场景切换
      {
            CAN_BACK = false
            var outLayer = data.out
            var inLayer = data.in
            if (!(inLayer && outLayer)) {
                  cc.log("null layer was call")
                  return
            }
            var past = data.back
            var fun = data.fun
            var notChange = data.notChange || false
            var forceDelete = data.forceD
            addCover()
            var time = changeTime
            if (notChange) {
                  time = 0.001
            }
            var scene = cc.director.getRunningScene()
            if (inLayer.myCtor) {
                  inLayer.myCtor()
            }
            if (inLayer.alreadyEnter && inLayer.reEnter) {
                  inLayer.reEnter()
            }
            if (!scene.clipNode) {
                  var lay = createLayout({
                        pos: cc.p(0, 0),
                        size: cc.director.getWinSize(),
                        op: 0,
                  })
                  scene.clipNode = lay
                  lay.setAnchorPoint(0, 0)
                  scene.addChild(lay)
                  lay.setClippingEnabled(true)
                  lay.setCascadeOpacityEnabled(true)
            }
            outLayer.retain()
            outLayer.removeFromParent(false)
            scene.clipNode.addChild(outLayer)
            outLayer.setCascadeOpacityEnabled(true)
            outLayer.release()
            getLoopOp(scene.clipNode)
            var outCount = 0
            var afterFun = function(item) {
                  outCount--
                  if (outCount == 0) {
                        item.setPosition(0, 0)
                        outLayer.retain()
                        outLayer.removeFromParent(false)
                        scene.addChild(outLayer)
                        outLayer.release()
                        removeCover()
                        var del = false
                        if (outLayer.myExit) {
                              outLayer.myExit()
                        }
                        if (forceDelete != null) {
                              del = forceDelete

                        } else {
                              del = outLayer.changeDelete
                        }
                        if (del) {
                              if (outLayer.myDelete) {
                                    outLayer.myDelete()
                              }
                              layerControl.deleteLayer(outLayer)
                        } else {
                              outLayer.setVisible(false)
                        }
                        if (inLayer.myEnter && !inLayer.alreadyEnter) {
                              inLayer.myEnter()
                              inLayer.alreadyEnter = true
                        } else {
                              CC_CURRENT_LAYER = inLayer
                        }
                        if (fun) {
                              fun()
                        }
                        CAN_BACK = true
                  }
            }
            addShowType({
                  item: scene.clipNode,
                  show: "fadeOut",
                  time: time,
                  fun: function(item) {
                        afterFun(item)
                  }
            })
            outCount++
            outLayer.setPosition(cc.p(0, 0))
            inLayer.setPosition(cc.p(0, 0))
            addShowType({
                  item: scene.clipNode,
                  show: "moveTo",
                  time: time,
                  buf: cc.p(-cc.director.getWinSize().width, 0),
                  fun: function(item) {
                        afterFun(item)
                  }
            })
            outCount++
            setLoopOp(inLayer)
            if (inLayer.getParent()) {
                  if (inLayer.getParent() == scene) {} else {
                        inLayer.removeFromParent(false)
                        scene.addChild(inLayer)
                  }
            } else {
                  scene.addChild(inLayer)
            }
            inLayer.setOpacity(255)
            inLayer.setVisible(true)
            scene.clipNode.setLocalZOrder(1)
            inLayer.setLocalZOrder(0)
            outLayer.setLocalZOrder(-1)
            if (past) {
                  inLayer.pastLayer = past
            }
      }

changeLayer = func.changeLayer

func.seekWidgetByName = function(rootNode, name) {
      //查找指定node下对应名称的UI
      if (!rootNode) {
            return null;
      }
      if (rootNode.getName() === name)
            return rootNode;
      var arrayrootNodeChildren = rootNode.getChildren();
      var length = arrayrootNodeChildren.length;
      for (var i = 0; i < length; i++) {
            var child = arrayrootNodeChildren[i];
            var res = seekWidgetByName(child, name);
            if (res !== null) {
                  return res;
            }
      }
      return null;
}

seekWidgetByName = func.seekWidgetByName

func.loadUI = function(src, json, uilist)
      //加载指定json中的所有资源并把uilist中定义的资源捆绑到src上
      {
            src.loadUI = ccs.load(json).node
            src.addChild(src.loadUI)
                  //cc.log(src.loadUI)
            for (var i = 0; i < uilist.length; i++) {
                  src[uilist[i]] = seekWidgetByName(src.loadUI, uilist[i])
            }
      }

loadUI = func.loadUI

func.loadList = function(item, list) {
      for (var i = 0; i < list.length; i++) {
            var temp = seekWidgetByName(item, list[i])
            if (temp) {
                  item[list[i]] = temp
            }
      }
}

loadList = func.loadList

func.loadNode = function(json, uilist, father)
      //加载json中所有资源并返回 如果传入uilist则会捆绑对应list中所有资源可直接命名访问
      {
            if (uilist) {
                  var node = ccs.load(json).node
                  var fat = null
                  if (father) {
                        fat = seekWidgetByName(node, father)
                  }
                  for (var i = 0; i < uilist.length; i++) {
                        if (fat) {
                              fat[uilist[i]] = seekWidgetByName(node, uilist[i])
                        } else {
                              node[uilist[i]] = seekWidgetByName(node, uilist[i])
                        }
                  }
                  if (fat) {
                        fat.removeFromParent(false)
                        return fat
                  } else {
                        return node
                  }
            } else {
                  return ccs.load(json).node
            }
      }

loadNode = func.loadNode

func.showType = {
      scale: "scale", //放大 缩小 淡入 淡出 移动
      zoom: "zoom",
      fadeIn: "fadeIn",
      fadeOut: "fadeOut",
      moveTo: "moveTo",
      moveBy: "moveBy",
      circle: "circle",
      tintTo: "tintTo",
      rotateTo: "rotateTo",
      rotateBy: "rotateBy",
      shakeF: "shakeF",
      scaleTo: "scaleTo",
      scaleLoop: "scaleLoop",
      moveBackForever: "moveBackForever",
      blink: "blink",
      scaleSize: "scaleSize",
}

func.addShowType = function(data)
      //添加特效
      {
            var item = data.item //特效执行对象
            var showType = data.show //特效类型
            var time = data.time || 0.3 //特效时间
            var fun = data.fun //特效结束调用函数
            var buf = data.buf //执行参数
            var action = null
            var infun = data.infun //循环特效每次执行函数
            var ifforever = false
            var needop = false
            var delay = data.delay
            var scale = data.scale || 1
            var repeat = data.repeat || 1
            var count = data.count || 1
            if (repeat == cc.REPEAT_FOREVER) {
                  repeat = cc.REPEAT_FOREVER / 2
            }
            var init = null
            time = time || 0.1
            switch (showType) {
                  case func.showType.scaleSize:
                        var tscale = getSizeScale({
                              item: item,
                              width: buf.width,
                              height: buf.height,
                        })
                        action = cc.scaleTo(time, tscale.x, tscale.y)
                        break
                  case func.showType.blink:
                        action = cc.blink(time, count)
                        break
                  case func.showType.moveBackForever:
                        ifforever = true
                        action = cc.repeatForever(cc.sequence(cc.moveBy(time, buf), cc.moveBy(time, cc.p(-buf.x, -buf.y)),
                              cc.callFunc(function() {
                                    if (infun) {
                                          infun()
                                    }
                              })))
                        break
                  case func.showType.scale:
                        action = cc.sequence(cc.callFunc(
                              function() {
                                    item.setScale(0)
                              }), cc.scaleTo(time, scale))
                        break
                  case func.showType.zoom:
                        action = cc.sequence(cc.callFunc(
                              function() {
                                    //item.setScale(1)
                              }), cc.scaleTo(time, 0))
                        break
                  case func.showType.scaleTo:
                        var tx = buf.x || buf
                        var ty = buf.y || buf
                        action = cc.scaleTo(time, tx, ty)
                        break
                  case func.showType.scaleLoop:
                        var from = buf.from
                        var to = buf.to
                        init = function(item) {
                              item.setScale(from)
                        }
                        action = cc.sequence(cc.scaleTo(time, to), cc.scaleTo(time, from))
                        break
                  case func.showType.fadeIn:
                        needop = true
                        action = cc.sequence(cc.callFunc(
                              function() {
                                    item.setOpacity(0)
                              }), cc.fadeIn(time))
                        break
                  case func.showType.fadeOut:
                        needop = true
                        action = cc.sequence(cc.callFunc(
                              function() {
                                    item.setOpacity(255)
                              }), cc.fadeOut(time))
                        break
                  case func.showType.moveTo:
                        action = cc.moveTo(time, buf)
                        break
                  case func.showType.moveBy:
                        action = cc.moveBy(time, buf)
                        break
                  case func.showType.circle:
                        ifforever = true
                        action = cc.repeatForever(cc.rotateBy(time, 360))
                        break
                  case func.showType.tintTo:
                        action = cc.tintTo(time, buf.r, buf.g, buf.b)
                        break
                  case func.showType.rotateTo:
                        action = cc.rotateTo(time, buf)
                        break
                  case func.showType.rotateBy:
                        action = cc.rotateBy(time, buf)
                        break
                  case func.showType.shakeF:
                        ifforever = true
                        action = cc.repeatForever(cc.sequence(cc.moveBy(time, buf), cc.moveBy(time, cc.p(-buf.x, -buf.y))))
                        break
            }
            if (delay) {
                  action = cc.sequence(cc.delayTime(delay), action)
            }
            if (infun) {
                  action = cc.sequence(action, cc.callFunc(function() {
                        if (infun) {
                              if (item) {
                                    infun(item)
                              } else {
                                    infun()
                              }
                        }
                  }))
            }
            if (repeat != 1 && !ifforever) {
                  action = cc.repeat(action, repeat)
            }
            if (action && item) {
                  if (init) {
                        init(item)
                  }
                  if (needop) {
                        if (item.setCascadeOpacityEnabled) {
                              item.setCascadeOpacityEnabled(true)
                        }
                  }
                  if (ifforever) {
                        item.runAction(action)
                        if (fun) {
                              cc.log("this is forever action, can not callback")
                        }
                  } else {
                        item.runAction(cc.sequence(action, cc.callFunc(function() {
                              if (fun) {
                                    fun(item)
                              }
                        })))
                  }
            } else {
                  cc.log("err", item, action)
            }
      }

addShowType = func.addShowType

func.getSize = function(res, scale) {
      scale = scale || 1
      var img = new cc.Sprite(res)
      var result = cc.size(img.getContentSize().width * scale, img.getContentSize().height * scale)
            //img.release()
      return result
}

getSize = func.getSize

func.getMiddle = function(x, y) {
      x = x || 0
      y = y || 0
      return cc.p(cc.director.getWinSize().width / 2 + x, cc.director.getWinSize().height / 2 + y)
}

getMiddle = func.getMiddle

/*获得字符串实际长度，中文2，英文1
 * str获得长度的字符串
 * */
func.getStrLength = function(str) {
      var realLength = 0,
            len = str.length,
            charCode = -1;
      for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
      }
      return realLength
}

getStrLength = func.getStrLength

func.autoCreatRow = function(srcstr, desnum) {
      var desstr = "";
      var curnum = Math.floor(func.getStrLength(srcstr) / desnum)
      cc.log(curnum)
      if (curnum) {
            for (var i = 0; i < curnum; i++) {
                  var str = srcstr.substr(i * desnum, desnum) + "\n";
                  desstr = desstr + str;
            }
      }
      return desstr
}

func.getAnchor = function(data) {
      var item = data.item
      var pos = data.pos
      var anchor = data.anchor
      var srcAnchor = item.getAnchorPoint()
      var size = item.getContentSize()
      var offAnchor = cc.p(srcAnchor.x - anchor.x, srcAnchor.y - anchor.y)
      var offPos = cc.p(pos.x - size.width * offAnchor.x, pos.y - size.height * offAnchor.y)
      return offPos
}

getAnchor = func.getAnchor

func.setLoopOp = function(rootNode, op) {
      if (!rootNode) {
            return null;
      }
      var judge = op != null ? op : rootNode.rootOp
      if (judge == null) {
            judge = 255
      }
      rootNode.setOpacity(judge)
      var arrayrootNodeChildren = rootNode.getChildren();
      var length = arrayrootNodeChildren.length;
      for (var i = 0; i < length; i++) {
            var child = arrayrootNodeChildren[i]
            setLoopOp(child, op)
      }
}

setLoopOp = func.setLoopOp


func.getLoopOp = function(rootNode, log) {
      if (!rootNode) {
            return null;
      }
      rootNode.rootOp = rootNode.getOpacity()
      if (log) {
            cc.log(rootNode.rootOp)
      }
      var arrayrootNodeChildren = rootNode.getChildren();
      var length = arrayrootNodeChildren.length;
      for (var i = 0; i < length; i++) {
            var child = arrayrootNodeChildren[i]
            getLoopOp(child, log)
      }
}

getLoopOp = func.getLoopOp

var IMG_ZERO = 0
func.createGuancha = function(data) {

      var size = data.size
      var imglists = data.imglist
      var rectlist = data.rectlist
      var nodeInrect = data.nodeInrect || []
      var startoffset = data.startoffset || 20
      var midoffset = data.midoffset || 15
      var endoffset = data.endoffset || 75
      var direction = data.direction || "horizontal" //"vertical"
      var scale = data.scale || 1
      var fromExp = data.fromExp || "see"
      var father = data.father
      var btnoffset = data.btnoffset || 25
      var rectNum = data.rectNum || 1000

      loadPlist("extranums")

      //每个rect对应一个存放精灵的数组
      var rectarray = []
      for (var i = 0; i < rectlist.length; i++) {
            var tmparray = []
            rectarray.push(tmparray)
      }

      var splist = []
      var node = new cc.Node()
      var layout = new ccui.Layout();
      layout.y = 25
      layout.setClippingEnabled(true);
      layout.setContentSize(size.width, size.height - 60);
      node.addChild(layout)

      var itemlist = new cc.Node()
      itemlist.x = size.width / 2
      itemlist.y = layout.height
      layout.addChild(itemlist)

      var imgsnode = new cc.Node()
      imgsnode.setName("imgsnode")
      imgsnode.x = cc.winSize.width / 2;
      imgsnode.y = cc.winSize.height / 2
      father.addChild(imgsnode, 500)
      var imglist = mixArray(imglists)

      for (var i = 0; i < imglist.length; i++) {
            var sp = new cc.Sprite(imglist[i][0])
            sp.index = i
            sp.teamnum = imglist[i][2]
            itemlist.addChild(sp)
            splist.push(sp)
            var mid = (layout.height - 2 * startoffset - 3 * sp.height) / 2

            if (i == 0)
                  sp.y = -sp.height / 2 - startoffset
            else
            if (i % 3 == 0)
                  sp.y = splist[i - 1].y - 40 - sp.height
            else
                  sp.y = splist[i - 1].y - mid - sp.height

            createTouchEvent({
                  item: sp,
                  touchX: 65,
                  touchY: 520,
                  begin: function(data) {
                        var item = data.item
                        var pos = data.pos
                        item.setOpacity(100)
                        item.spp = new cc.Sprite(imglist[item.index][0])
                        pos = node.getParent().convertToNodeSpace(pos)
                        item.spp.setPosition(pos)
                        item.spp.index = item.index
                        item.spp.teamnum = item.teamnum
                        item.spp.father = item
                        node.getParent().addChild(item.spp)
                        createTouchEvent({
                              item: item.spp,
                              begin: function(data) {
                                    var item = data.item
                                    item.setLocalZOrder(100)
                                    item.setScale(1)
                                    item.startpos = item.getPosition()
                                    item.delitem = rectarray[item.arrayindex].splice(item.listindex, 1)
                                    //排序
                                    node.paixu(item.arrayindex)
                                  
                                    return true
                              },
                              move: function(data) {
                                    data.item.x += data.delta.x
                                    data.item.y += data.delta.y
                              },
                              end: function(data) {
                                    var item = data.item
                                    var tmp = item.delitem

                                    for (var i in rectlist)
                                          if (cc.rectContainsPoint(rectlist[i], item.getPosition())) {

                                                item.arrayindex = i
                                                node.addItem(i,tmp[0])
                                                //node.paixu(i)

                                                for (var m = 0; m < rectarray.length; m++)
                                                      if (rectarray[m].length == 0) {
                                                            if (nodeInrect[m])
                                                                  nodeInrect[m].setVisible(true)
                                                      } else {
                                                            if (nodeInrect[m])
                                                                  nodeInrect[m].setVisible(false)
                                                      }

                                                return
                                          }
                                    item.father.setOpacity(255)
                                    item.father.disListen(false)
                                    item.removeFromParent()

                                    for (var m = 0; m < rectarray.length; m++) {

                                          if (rectarray[m].length == 0) {
                                                if (nodeInrect[m])
                                                      nodeInrect[m].setVisible(true)

                                          }
                                    }
                              }

                        })

                        if (imglist[item.index][1] && imglist[item.index][1] != "") {
                              var addbn = new ccui.Button(res.btn_add_normal, res.btn_add_select)
                              addbn.x = 40;
                              addbn.y = 20
                              addbn.setScale(0.8)
                              item.spp.addChild(addbn)
                              addbn.index = item.index
                              addbn.addClickEventListener(function(sender, type) {
                                    var scaleimg = new cc.Sprite(imglist[sender.index][1])
                                    scaleimg.setPosition(25 * imgsnode.getChildrenCount(), 0)
                                    scaleimg.index = sender.index
                                    createTouchEvent({
                                          item: scaleimg,
                                          begin: function(data) {
                                                data.item.setLocalZOrder(IMG_ZERO++)
                                                return true
                                          },
                                          move: function(data) {
                                                data.item.x += data.delta.x
                                                data.item.y += data.delta.y
                                          }
                                    })
                                    scaleimg.setOpacity(150)
                                    scaleimg.runAction(cc.sequence(cc.moveBy(0.1, 0, 10),
                                          cc.callFunc(function() {
                                                scaleimg.setOpacity(255);
                                          })))
                                    var closebtn = new ccui.Button(res.btn_tipclose_select, res.btn_tipclose_normal)
                                    closebtn.setPosition(scaleimg.width - btnoffset, scaleimg.height - btnoffset)
                                    closebtn.setScale(0.9)
                                    scaleimg.addChild(closebtn)
                                    closebtn.addClickEventListener(function() {
                                          this.getParent().removeFromParent(true)
                                    })
                                    for (var i in imgsnode.getChildren())
                                          if (imgsnode.getChildren()[i].index == sender.index)
                                                imgsnode.getChildren()[i].removeFromParent(true)

                                    imgsnode.addChild(scaleimg)
                                    scaleimg.setLocalZOrder(1)

                              })
                        }

                        return true
                  },
                  move: function(data) {
                        data.item.spp.setLocalZOrder(100)
                        data.item.spp.x += data.delta.x
                        data.item.spp.y += data.delta.y
                  },
                  end: function(data) {
                        var item = data.item

                        for (var i in rectlist) {
                              if (cc.rectContainsPoint(rectlist[i], item.spp.getPosition())) {

                                    item.disListen(true)
                                    item.spp.arrayindex = i

                                    node.addItem(i, item.spp)

                                    //node.paixu(i,item.spp)

                                    return

                              }
                        }
                        item.setOpacity(255)
                        data.item.disListen(false)
                        item.spp.removeFromParent()

                  }
            })
      }


      //页码数
      var numslist = []
      for (var n = 1; n < 10; n++) {
            var numstr = n + "0000"
            numslist.push(numstr)
      }

      var numsp1 = new cc.Sprite("#" + numslist[0])
      numsp1.setPosition(size.width / 2 - 60, size.height - 20)
      node.addChild(numsp1)
      var numspgang = new cc.Sprite("#gang0000")
      numspgang.setPosition(size.width / 2 - 40, size.height - 20)
      node.addChild(numspgang)
      var imgnum = Math.ceil(imglist.length / 3) - 1
      var numsp2 = new cc.Sprite("#" + numslist[imgnum])
      numsp2.setPosition(size.width / 2 - 20, size.height - 20)
      node.addChild(numsp2)

      //上下按钮
      var count = 0
      var upbtn = new ccui.Button(res.btn_right_normal, res.btn_right_select)
      var downbtn = new ccui.Button(res.btn_right_normal, res.btn_right_select)
      upbtn.setPosition(size.width / 2 + 30, size.height - 10)
      upbtn.setRotation(-90)
      upbtn.setScale(0.3)
      node.addChild(upbtn)
      upbtn.setVisible(false)
      upbtn.addClickEventListener(function() {

            if (count > 0) {
                  count--;
                  if (count <= 0)
                        upbtn.setVisible(false)

                  downbtn.setVisible(true)
                  itemlist.runAction(cc.moveBy(0.2, cc.p(0, -layout.height)))
                  numsp1.setSpriteFrame(numslist[count])
            }
      })


      downbtn.setPosition(size.width / 2 + 30, 10)
      downbtn.setRotation(90)
      downbtn.setScale(0.3)
      node.addChild(downbtn)
      downbtn.addClickEventListener(function() {
            if (count < Math.floor(imglist.length / 3)) {
                  count++;
                  if (count >= Math.ceil(imglist.length / 3 - 1))
                        downbtn.setVisible(false)
                  upbtn.setVisible(true)
                  itemlist.runAction(cc.moveBy(0.2, cc.p(0, layout.height)))
                  numsp1.setSpriteFrame(numslist[count])
            }
      })

      node.addItem = function(num, newitem) {
            var i = num
            var item = newitem
            var tempDis = null

            var tempFun = function(key) {
                  for (var k = 0; k < rectarray[i].length; k++) {
                        if (k == 0 || k == rectarray[i].length - 1) {
                              if (tempDis <= rectarray[i][0][key]) {
                                    rectarray[i].splice(0, 0, item)
                                    item.lisindex = 0
                                    break;
                              }
                              if (tempDis >= rectarray[i][rectarray[i].length - 1][key]) {
                                    rectarray[i].splice(rectarray[i].length, 0, item)
                                    item.lisindex = rectarray[i].length-1
                                    break;
                              }
                        }
                        if (k >= 1) {
                              if (tempDis >= rectarray[i][k - 1][key] && tempDis <= rectarray[i][k][key]) {
                                    rectarray[i].splice(k, 0, item)
                                    item.lisindex = k
                                    break
                              }
                        }
                  }
                  if (!rectarray[i].length) {

                        if (nodeInrect[i])
                              nodeInrect[i].setVisible(false)
                        rectarray[i].push(item)
                        item.lisindex = 0
                  }
            }

            switch (direction) {
                  case "horizontal":
                        tempDis = item.x
                        tempFun("x")
                        break
                  case "vertical":
                        tempDis = item.y
                        tempFun("y")
                        break
            }

            node.paixu(i,item)
      }

      node.paixu = function(num,newitem) {

            var i = num

            //排序之前的处理
            if(newitem){
                 var  getlist = []
                 var  removelist = []
                 if(rectNum<rectarray[i].length){

                        if(newitem.lisindex == rectNum){
                              var temp = rectarray[i][rectNum]
                              rectarray[i][rectNum] = rectarray[i][rectNum-1]
                              rectarray[i][rectNum-1] = temp
                        }

                          for(var j=0;j<rectNum;j++){
                              getlist[j] = rectarray[i][j]
                          }

                          for(var k=rectNum;k<rectarray[i].length;k++){
                               removelist[k] = rectarray[i][k]
                               removelist[k].setVisible(false)
                               removelist[k].father.setOpacity(255)
                               removelist[k].father.disListen(false)
                               removelist[k].removeFromParent()
                          }
                        
                          rectarray[i] = []
                          for(var m = 0;m<getlist.length;m++)
                               rectarray[i][m] = getlist[m]
                       
                 } 
            }

            var tempFun = function(key) {
                  var otherkey = (key == "x") ? "y" : "x"
                  var templen  = (key == "x") ? "width" : "height"
                  var templenTo = (key == "x") ? "height" : "width"
                  for (var k = 0; k < rectarray[i].length; k++) {
                        if (1 == rectarray[i].length)
                              rectarray[i][k][key] = rectlist[i][key] + rectlist[i][templen] / 2
                        else
                              rectarray[i][k][key] = rectlist[i][key] + (k + 1) * rectlist[i][templen] / (rectarray[i].length + 1)

                        rectarray[i][k][otherkey] = rectlist[i][otherkey] + rectlist[i][templenTo] / 2
                        rectarray[i][k].setLocalZOrder(k)
                        rectarray[i][k].listindex = k
                        rectarray[i][k].setScale(scale)
                  }
            }

            switch (direction) {
                  case "horizontal":
                        tempFun("x")
                        break
                  case "vertical":
                        tempFun("y")
                        break
            }
      }

      node.getRectarray = function() {
            return rectarray
      }

      node.getJielun = function() {

            var count = 0
            var lenflag = false
            for (var i = 0; i < rectarray.length; i++) {
                  for (var n = 0; n < rectarray[i].length; n++) {
                        lenflag = true
                        if (rectarray[i][n].teamnum != i)
                              count++;
                  }
            }

            var fault_mp
            var right_mp

            switch (fromExp) {
                  case "see":
                        {
                              fault_mp = res.sound_fault_bs
                              right_mp = res.sound_right_bs
                        }
                        break
                  case "do":
                        {
                              fault_mp = res.sound_fault
                              right_mp = res.sound_right
                        }
                        break
            }


            if (count == 0 && lenflag)
                  dialogControl.AddDialog("Tips", {
                        res: res.img_correct,
                        face: 1,
                        sound: right_mp,
                        father: father
                  });
            else
                  dialogControl.AddDialog("Tips", {
                        res: res.img_fault,
                        modify: cc.p(30, 0),
                        face: 2,
                        sound: fault_mp,
                        father: father
                  });
      }


      node.showdaan = function(res_img) {
            var daansp = father.getChildByName("daan")
            if (daansp) {
                  daansp.runAction(cc.sequence(
                        cc.scaleTo(0.2, 0),
                        cc.callFunc(function() {
                              daansp.removeFromParent()
                        })
                  ))
            } else {
                  var daanbg = new cc.Sprite(res_img)
                  daanbg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2)
                  daanbg.setName("daan")
                  father.addChild(daanbg)
                  daanbg.setScale(0)
                  daanbg.setLocalZOrder(LOCAL_ORDER++)
                  safeAdd(daanbg.getParent(), daanbg)
                  daanbg.runAction(cc.scaleTo(0.2, 1))
                  createTouchEvent({
                        item: daanbg,
                        begin: function(data) {
                              var item = data.item
                              item.setLocalZOrder(LOCAL_ORDER++)
                              safeAdd(item.getParent(), item)
                              return true
                        },
                        autoMove: true,
                  })
                  var closebtn = new ccui.Button(res.btn_result_quit_normal, res.btn_result_quit_select)
                  closebtn.setPosition(daanbg.width - 30, daanbg.height - 30)
                  closebtn.addClickEventListener(function(sender, type) {
                        this.getParent().runAction(cc.sequence(
                              cc.scaleTo(0.2, 0),
                              cc.callFunc(function() {
                                    if (sender.getParent().removeListen) {
                                          sender.getParent().removeListen()
                                    }
                                    sender.getParent().removeFromParent()
                              })
                        ))
                  })
                  daanbg.addChild(closebtn)
            }
      }

      node.clearAllspInRect = function() {
            for (var i in rectarray)
                  for (var k in rectarray[i])
                        rectarray[i][k].removeFromParent()
      }
      node.clearImgsnode = function() {
            imgsnode.removeAllChildren()
      }
      node.initagain = function() {
            this.clearAllspInRect()
            this.clearImgsnode()
            var daansp = father.getChildByName("daan")
            if (daansp)
                  daansp.runAction(cc.sequence(
                        cc.scaleTo(0.2, 0),
                        cc.callFunc(function() {
                              daansp.removeFromParent()
                        })
                  ))

            var dialog = dialogControl["Tips"]
            if (dialog)
                  dialog.onOut()
      }

      return node
}

func.createLink = function(data) {
      var touchs = data.touchs
      var links = data.links
      var normal = data.normal || "normal"
      var select = data.select || "select"
      var init = data.init || 0
      var move = data.moveNode
      if (touchs && links && touchs.length == links.length) {
            var showIndex = function(index) {
                  if (move) {
                        var buf = null
                        var count = 0
                        for (var i = 0; i < touchs.length; i++) {
                              if (index == i) {
                                    buf = cc.p(move.list[i].rootX - move.list[i].getPositionX(), 0)
                              }
                        }
                        for (var i = 0; i < touchs.length; i++) {
                              var temp = move.list[i]
                              count++
                              addShowType({
                                    item: temp,
                                    show: "moveBy",
                                    time: 0.1,
                                    buf: buf,
                                    fun: function() {
                                          count--
                                          if (count == 0) {
                                                move.canMove = true
                                          }
                                    }
                              })
                        }
                  }
                  for (var i = 0; i < touchs.length; i++) {
                        var child = touchs[i]
                        if (index == i) {
                              child[normal].setVisible(false)
                              child[select].setVisible(true)
                              child.link.setVisible(true)
                        } else {
                              child[normal].setVisible(true)
                              child[select].setVisible(false)
                              if (!move) {
                                    child.link.setVisible(false)
                              }
                        }
                  }
            }
            for (var i = 0; i < touchs.length; i++) {
                  var judge = touchs[i]
                  judge[normal] = judge.getChildByName(normal)
                  judge[select] = judge.getChildByName(select)
                  var nor = judge[normal]
                  nor.link = judge[select]
                  nor.judge = i
                  judge.link = links[i]
                  if (move) {
                        if (!move.list) {
                              move.list = []
                        }
                        move.list.push(links[i])
                        links[i].rootX = links[i].getPositionX()
                        links[i].setPositionX(links[i].getPositionX() + i * move.getContentSize().width)
                        move.maxPage = i
                  }
                  createTouchEvent({
                        item: nor,
                        end: function(data) {
                              var item = data.item
                              if (nor.isVisible() || nor.link.isVisible()) {
                                    showIndex(item.judge)
                              }
                        }
                  })
            }
            if (move) {
                  move.page = 0
                  move.canMove = true
                  createTouchEvent({
                        item: move,
                        begin: function(data) {
                              var item = data.item
                              var pos = data.pos
                              item.startPos = pos
                              if (item.canMove) {
                                    item.canMove = false
                                    return true
                              } else {
                                    return false
                              }
                        },
                        move: function(data) {
                              var item = data.item
                              var pos = data.pos
                              var delta = data.delta
                              for (var i = 0; i < item.list.length; i++) {
                                    item.list[i].x += delta.x
                              }
                        },
                        end: function(data) {
                              var item = data.item
                              var pos = data.pos
                              var result = item.page
                              if (Math.abs(pos.x - item.startPos.x) > 20) {
                                    result += ((pos.x - item.startPos.x) > 0 ? -1 : 1)
                                    if (result > item.maxPage) {
                                          result = item.maxPage
                                    }
                                    if (result < 0) {
                                          result = 0
                                    }
                              }
                              item.page = result
                              showIndex(result)
                        }
                  })
            }
            showIndex(init)
      }
}

createLink = func.createLink

//创建水蒸气
/*
createWaterAir({
            total: 40,
            width: 30,
            height: 10,
            res: res.yan,
        })*/
function createWaterAir(data) {
      var total = data.total
      var width = data.width
      var height = data.height
      var tex = data.res

      var size = data.size || cc.size(60, 20)
      var finalsize = data.finalsize || cc.size(130, 40)
      var sizevar = data.sizevar || cc.size(40, 10)

      var rotate = data.rotate || -15
      var rotatevar = data.rotatevar || 30
      var dis = data.dis || 150
      var disvar = data.disvar || 50
      var time = data.time || 1.5
      var timevar = data.timevar || 0.2

      var node = new cc.SpriteBatchNode(tex)
      node.list = []

      var reinit = function(temp, ifdelay) {
            ifdelay = ifdelay || false
            temp.setPosition(width * Math.random(), height * Math.random())
            var randsize = cc.size(size.width + Math.random() * sizevar.width, size.height + Math.random() * sizevar.height)
            var endSize = cc.size(finalsize.width + Math.random() * sizevar.width, finalsize.height + Math.random() * sizevar.height)
            setSize({
                  item: temp,
                  width: randsize.width,
                  height: randsize.height,
            })
            var randdis = dis + Math.random() * disvar
            var randRotate = rotate + Math.random() * rotatevar
            var buf = cc.p(randdis * Math.sin(randRotate / 180 * Math.PI), randdis * Math.cos(randRotate / 180 * Math.PI))
            var delay = ifdelay ? Math.random() * time : 0
            var finalTime = time + Math.random() * timevar
            temp.count = 0
            temp.stopAllActions()
            temp.setOpacity(0)
            addShowType({
                  item: temp,
                  show: "scaleSize",
                  time: finalTime,
                  buf: endSize,
                  delay: delay,
                  fun: function(item) {
                        item.count--
                              if (item.count <= 0) {
                                    reinit(item)
                              }
                  }
            })
            temp.count++
                  addShowType({
                        item: temp,
                        show: "moveTo",
                        time: finalTime,
                        buf: buf,
                        delay: delay,
                        fun: function(item) {
                              item.count--
                                    if (item.count <= 0) {
                                          reinit(item)
                                    }
                        }
                  })
            temp.count++
                  addShowType({
                        item: temp,
                        show: "fadeOut",
                        time: finalTime,
                        delay: delay,
                        fun: function(item) {
                              item.count--
                                    if (item.count <= 0) {
                                          reinit(item)
                                    }
                        }
                  })
            temp.count++
      }

      for (var i = 0; i < total; i++) {
            var temp = new cc.Sprite(tex)
            reinit(temp, true)
            node.list[i] = temp
            node.addChild(temp)
      }

      return node
}