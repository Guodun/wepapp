Page({
  data:{
    city:"",//所在城市
    cityId:"",//api城市id
    tmp:"",//温度
    wind:"",//风力状况
    cond:"",//天气状况
    sc:"",//风力等级
    txt:"",//详情
    future:{}//未来天气
    
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.loadInfo();
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  loadInfo:function(){
    var page =this;
    wx.getLocation({//动态获取所在位置经纬度
      type: 'gcij2',
      success: function(res){
        var latitude = res.latitude;//获取维度
        var longitude = res.longitude;//获取经度
        page.loadCity(latitude,longitude);
        page.loadCityId();
      }
    })
  },
  loadCity:function(latitude,longitude){//根据经纬度，调用百度api获取对应城市
    var page=this;
    wx.request({
      url: "https://api.map.baidu.com/geocoder/v2/?ak=L4Z3WER8KIjNeirIQNl7lBfKy2n4fpp2&location="+latitude+","+longitude+"&output=json",
      header: {
        "content-type": "application/json"
      },
      success: function(res){
        var city = res.data.result.addressComponent.city;//获取城市
        city = city.replace("市","");//为了匹配，去掉多余字
        page.setData({city:city});//city保存到data
      }
    })
  },
  loadCityId:function(){//调用和风日丽的城市api
    var page = this;
     wx.request({ 
      url: "https://api.heweather.com/x3/citylist?search=allchina&key=7dde3b12f5734c27a7bfa74dc3d64cf5",
      hearder: {
        "content-type": "application/json"
      },
      success: function(res){
        for(var i=0;i<res.data.city_info.length;i++){//循环打印城市列表
          if(res.data.city_info[i].city===page.data.city){//匹配当前城市
            page.setData({
              cityId: res.data.city_info[i].id,//保存匹配的id
            })
            break;
          }
        }
        page.loadWeather(page.data.cityId);
      }
    })
  },
  loadWeather:function(cityId){//根据城市id，获取对应的城市天气
    var page=this;
    wx.request({ //调用风和日丽的天气api接口
      url: "https://api.heweather.com/x3/weather?cityid="+cityId+"&key=7dde3b12f5734c27a7bfa74dc3d64cf5",
      hearder: {
        "content-type": "application/json"
      },
      success: function(res){
        console.log(res)
        page.setData({//获取天气数据
          tmp: res.data["HeWeather data service 3.0"]["0"].now.tmp,
          wind: res.data["HeWeather data service 3.0"]["0"].now.wind.dir,
          cond: res.data["HeWeather data service 3.0"]["0"].now.cond.txt,
          sc: res.data["HeWeather data service 3.0"]["0"].now.wind.sc,
          txt: res.data["HeWeather data service 3.0"]["0"].suggestion.comf.txt,
          future: res.data["HeWeather data service 3.0"]["0"].daily_forecast.slice(1,5)
        })
      }
    })
  },
})

