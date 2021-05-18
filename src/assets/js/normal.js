// 提取年月日变为01/03
export function dataDeal(dataList) {
  for (var i = 0; i < dataList.length; i++) {
    dataList[i].oldtime = dataList[i].time
    dataList[i].time = new Date(dataList[i].time)
    dataList[i].year = dataList[i].time.getFullYear()
    dataList[i].date = (dataList[i].time.getMonth() + 1 < 10 ? "0" + (dataList[i].time.getMonth() +
        1) : dataList[i].time.getMonth() + 1) +
      "/" +
      (dataList[i].time.getDate() < 10 ? "0" + dataList[i].time.getDate() : dataList[i].time.getDate())
  }
}

// 处理html内容
export function contentDeal(dataList) {
  dataList.forEach(item => {
    item.oldContent = item.content
    item.content = item.content.replace(/(\n)/g, "").replace(/(\t)/g, "").replace(/(\r)/g, "").replace(
      /<\/?[^>]*>/g, "").replace(/\s*/g, "")
  })
}

// 转换s->h:m:s
export function durationDeal(dataList) {
  dataList.forEach(item => {
    if (item.time !== null && item.time !== '') {
      if (item.time >= 60 && item.time < 60 * 60) {
        if (parseInt(item.time / 60.0) < 10) {
          var minute = '0' + parseInt(item.time / 60.0)
        }
        if (parseInt((parseFloat(item.time / 60.0) - parseInt(item.time / 60.0)) * 60) < 10) {
          var second = parseInt((parseFloat(item.time / 60.0) - parseInt(item.time / 60.0)) * 60) + '0'
        }
        item.time = minute + ":" + second
      } else if (item.time > 60 * 60 && item.time < 60 * 60 * 24) {
        item.time = parseInt(item.time / 3600.0) + ":" + parseInt((parseFloat(item.time / 3600.0) -
          parseInt(item.time / 3600.0)) * 60) + ":" + parseInt((parseFloat((parseFloat(item.time / 3600.0) -
          parseInt(item.time / 3600.0)) * 60) - parseInt((parseFloat(item.time / 3600.0) - parseInt(item
          .time / 3600.0)) * 60)) * 60)
      } else {
        item.time = '00:' + parseInt(item.time);
      }
    }
  })
}

// 处理价格和内容
export function deal(data) {
  data.forEach(item => {
    item.new_intro = item.introduction.replace(/(\n)/g, "").replace(/(\t)/g, "").replace(/(\r)/g, "").replace(
      /<\/?[^>]*>/g, "").replace(/\s*/g, "")
    if (item.price === 0) {
      item.newPrice = '免费'
    } else {
      item.price = Math.round(item.price * 100) / 100;
      var s = item.price.toString().split(".");
      if (s.length == 1) {
        item.price = item.price.toString() + ".00";
      } else if (s.length > 1) {
        if (s[1].length < 2) {
          item.price = item.price.toString() + "0";
        }
      }
      item.newPrice = '¥' + item.price
    }
  })
}

export function deal2(data) {
  data.forEach(item => {
    if (item.price === 0) {
      item.newPrice = '免费'
    } else {
      item.price = Math.round(item.price * 100) / 100;
      var s = item.price.toString().split(".");
      if (s.length == 1) {
        item.price = item.price.toString() + ".00";
      } else if (s.length > 1) {
        if (s[1].length < 2) {
          item.price = item.price.toString() + "0";
        }
      }
      item.newPrice = '¥' + item.price
    }
  })
}

// 将时间转换为几分钟前
export function changeTime(val) {
  var str = val;
  //将字符串转换成时间格式
  var timePublish = new Date(str);
  var timeNow = new Date();
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  var diffValue = timeNow - timePublish;
  var diffMonth = diffValue / month;
  var diffWeek = diffValue / (7 * day);
  var diffDay = diffValue / day;
  var diffHour = diffValue / hour;
  var diffMinute = diffValue / minute;
  var result = null;

  if (diffValue < 0) {
    // alert("错误时间");
  } else if (diffMonth > 3) {
    result = timePublish.getFullYear() + "-";
    result += timePublish.getMonth() + 1 + "-";
    result += timePublish.getDate();
    // alert(result);
  } else if (diffMonth > 1) {
    result = parseInt(diffMonth) + "月前";
  } else if (diffWeek > 1) {
    result = parseInt(diffWeek) + "周前";
  } else if (diffDay > 1) {
    result = parseInt(diffDay) + "天前";
  } else if (diffHour > 1) {
    result = parseInt(diffHour) + "小时前";
  } else if (diffMinute > 1) {
    result = parseInt(diffMinute) + "分钟前";
  } else {
    result = "刚刚发表";
  }
  return result;
}
