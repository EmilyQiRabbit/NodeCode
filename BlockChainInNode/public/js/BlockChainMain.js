function checkBlockchain(e){
  const options = {
    url: 'api/requestBlockchain',
    type: "POST",
    data: {},     // 如有用户信息，在此对象中添加 userId 属性
    dataType: "json",
    success: function (response, xml) {
      console.log(response)
      const resDate = JSON.parse(response).data;
      let html = ''
      resDate.forEach(function(block){
        html += 
        '<div>index: ' + block.index + '</div>' + 
        '<div>secrets: ' + block.secrets + '</div>' + 
        '<div>difficulty: ' + block.difficulty + '</div>' + 
        '<div>prevHash: ' + block.prevHash + '</div>' + 
        '<div>hash: ' + block.hash + '</div>' + 
        '<div>nonce: ' + block.nonce + '</div>' + 
        '<div style="height: 15px">--------------⬇︎--------------</div>'
      })
      document.getElementById('CheckBoard').innerHTML = html;
    },
    fail: function (status) {
      console.log("查询错误：", status)
    }
  };
  ajax(options)
}

function addBlock(e){
  const secrets = document.getElementById('secrets').value;
  if(secrets){
    const options = {
      url: 'api/addBlock',
      type: "POST",
      data: {secrets},
      dataType: "json",
      success: function (response, xml) {
        console.log(response)
        document.getElementById('CheckBoard').innerHTML = JSON.stringify(JSON.parse(response).msg)
      },
      fail: function (status) {
        console.log("查询错误：", status)
      }
    };
    ajax(options)
  }else{
    alert('请输入 secrets 哦！')
  }
}

function ajax(options) {
  // 原生Ajax
  options = options || {};
  options.type = (options.type || "GET").toUpperCase();
  options.dataType = options.dataType || "json";
  var params = formatParams(options.data);
  //创建(非IE6) - 第一步
  if (window.XMLHttpRequest) {
      var xhr = new XMLHttpRequest();
  } else { //IE6及其以下版本浏览器
      var xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  if (xhr == null){
      alert('您的浏览器不支持AJAX！');
      return;
  }
  //连接和发送 - 第二步
  if (options.type == "GET") {
      xhr.open("GET", options.url + "?" + params, true);
      xhr.send(null);
  } else if (options.type == "POST") {
      xhr.open("POST", options.url, true);
      //设置表单提交时的内容类型
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(params);
  }
  //接收 - 第三步
  xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
          var status = xhr.status;
          if (status >= 200 && status < 300) {
              options.success && options.success(xhr.responseText, xhr.responseXML);
          } else {
              options.fail && options.fail(status);
          }
      }
  }
}
function formatParams(data) {
  // Ajax 格式化参数
  var arr = [];
  for (var name in data) {
      arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
  }
  arr.push(("v=" + Math.random()).replace(".",""));
  return arr.join("&");
}