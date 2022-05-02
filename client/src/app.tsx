import Taro, { Component, Config, showLoading } from '@tarojs/taro'
import Index from './pages/index'
import { set as setGlobalData, get as getGlobalData } from '@/utils/globaldata'

import './app.scss'
import { GLOBAL_KEY_PAYSUCCESS, GLOBAL_KEY_RESULTCODE, GLOBAL_KEY_MSG, GLOBAL_KEY_PAYJSORDERID, AD_HIDDEN } from './constants/data'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/charge/charge',
      'pages/create-class/create-class',
      'pages/search-class/search-class',
      'pages/class-detail/class-detail',
      'pages/join-info/join-info',
      'pages/class-map/class-map',
      'pages/create-class/create-success/create-success',
      'pages/create-class/create-attention/create-attention',
      'pages/class-manage/class-manage'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      navigationStyle: 'custom'
    },
    plugins: {
      "routePlan": {
        "version": "1.0.8",
        "provider": "wx50b5593e81dd937a"
      }
    },
    cloud: true,
    permission: {
      "scope.userLocation": {
        "desc": "你的位置信息将用于在地图中展示"
      }
    },
    navigateToMiniProgramAppIdList: [
      "wx959c8c1fb2d877b5"
    ]
  }

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({
        env: 'test-xgu28',
      })
    }
  }



  async componentDidShow () {
    const { scene, referrerInfo } = this.$router.params
    console.log(scene, referrerInfo);
    
    if ( referrerInfo && referrerInfo['appId'] === 'wx959c8c1fb2d877b5') { 
      // 还应判断请求路径
      let extraData = referrerInfo['extraData']
      setGlobalData(GLOBAL_KEY_PAYSUCCESS, extraData['success'])
      setGlobalData(GLOBAL_KEY_RESULTCODE, extraData['resultCode'])
      setGlobalData(GLOBAL_KEY_MSG, extraData['msg'])
      setGlobalData(GLOBAL_KEY_PAYJSORDERID, extraData['payjsOrderId'])
    }

  }

  componentDidHide () {}

  componentDidCatchError () {}


  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
