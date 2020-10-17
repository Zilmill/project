var selectedObjects = [];

  function  wsOrder(lId,pId) {
    // 连接服务端
    // var socket = io('http://'+document.domain+':2120');
    var socket = io('http://118.123.247.236:2120');
    // 连接后登录
    socket.on('connect', function(){
      socket.emit('login', "411173437");
      // socket.emit('login', lId+'/'+pId);
      // console.log(uid);
    });
    // 后端推送来消息时
    socket.on('new_msg', function(msg){
      $('#content').html('收到消息：'+msg);
      console.log("order==========="+msg);
      $('.notification.sticky').notify();
    });
    // 后端推送来在线数据时
    socket.on('update_online_count', function(online_stat){
      console.log('update_online_count'+online_stat);
      $('#online_box').html(online_stat);
    });
    // 后端推送来在线数据时
    socket.on('order', function(order){
      var dataArr=JSON.parse(order)
      console.log(dataArr)
      if(dataArr.code==0){
        window.parent.frames.webStatus(dataArr.data)
        window.parent.frames.Command(dataArr)
        if(dataArr.data.status==1){
          var modelId=dataArr.data.order.YTYD_CODE;
          for (let i = 0; i <equipmentArrs.length ; i++) {
            if(modelId==equipmentArrs[i].modelId)  {
              // equipmentArrs[i].visible=false;
              if (dataArr.data.order.order == 10001) {  //安装高亮  安装中
                console.log(equipmentArrs[i].modelId,modelId)
                equipmentArrs[i].visible=true;
                equipmentArrs[i].traverse( function ( child ) {
                  if ( child.isMesh ) {
                    // child.material.emissive.set('#ff0000')
                    // child.material.color.set('rgb(255,0,0)')
                    child.material.color={r:255,g:0,b:0}
                    child.material.metalness=0;
                  }
                });
                window.parent.frames.UpOrderStatus(dataArr.data.order.order_id,dataArr.data.order.INSTALLER,'311173437')
              } else if (dataArr.data.order.order == 10002) { //正常显示 安装完成
                console.log(equipmentArrs[i].modelId,modelId)
                equipmentArrs[i].visible=true;

                equipmentArrs[i].traverse( function ( child ) {
                  if ( child.isMesh ) {
                    child.material.color=child.material.newColor
                    child.material.metalness=1;
                    // child.material.emissive.set('rgba(0,0,0)')
                  }
                });
                window.parent.frames.UpOrderStatus(dataArr.data.order.order_id,dataArr.data.order.INSTALLER,'311173437')
              }else if(dataArr.data.order.order == 10003){ //取消安装变灰/隐藏   取消安装
                console.log(equipmentArrs[i].modelId,modelId)
                equipmentArrs[i].visible=false;
                equipmentArrs[i].traverse( function ( child ) {
                  if ( child.isMesh ) {
                    // child.material.emissive.set('rgba(0,0,0,0.93)')
                    child.material.color={r:0,g:0,b:0}
                    child.material.metalness=0;
                  }
                });
                window.parent.frames.UpOrderStatus(dataArr.data.order.order_id,dataArr.data.order.INSTALLER,'311173437')
              }
            }
            //显示已经安装好的设备，其他变灰
            if(dataArr.data.order.order == 10004){
              var modelIdArr=dataArr.data.order.DEV;
              equipmentArrs[i].visible=false;
              equipmentArrs[i].traverse( function ( child ) {
                if ( child.isMesh ) {
                  child.material.color={r:0,g:0,b:0}
                }
              });
              for (let j = 0; j <modelIdArr.length ; j++) {
                if(modelIdArr[j].YTYD_CODE==equipmentArrs[i].modelId){
                  equipmentArrs[i].visible=true;
                  equipmentArrs[i].traverse( function ( child ) {
                    if ( child.isMesh ) {
                      child.material.color=child.material.newColor
                      child.material.metalness=1;
                      // child.material.emissive.set('rgba(0,0,0)')
                    }
                  });
                  $("#timeInfo").text(dataArr.data.start_date)
                }
              }
              window.parent.frames.UpOrderStatus(dataArr.data.order.order_id,dataArr.data.order.INSTALLER,'311173437')

            }
            else if(dataArr.data.order.order == 40001){   //退到所
              window.parent.frames.UpOrderStatus(dataArr.data.order.order_id,dataArr.data.order.INSTALLER,'311173437')
              window.parent.frames.returnPlace()
            }else if(dataArr.data.order.order == 40002){  //退到线
              window.parent.frames.UpOrderStatus(dataArr.data.order.order_id,dataArr.data.order.INSTALLER,'311173437')
              window.parent.frames.returnLine();
            }


          }
        }else if(dataArr.data.status==0){
          //主设备

        }
      }

    });

  }
