import { View, Text, Image } from '@tarojs/components'
import { useState, memo } from '@tarojs/taro'
import { NavBar } from 'taro-navigationbar'

import Search from '@/components/Search'
import ClassItem from '@/components/ClassItem'
import { SEARCHING, EXPECTION, SEARCH_EMPTY } from '@/constants/toast'
import empty from '../../assets/illustration_empty.png'
import './search-class.scss'
import { get } from '@/utils/globaldata'
import { AD_HIDDEN } from '@/constants/data'

function SearchClass() {
  const [classInfo, setClassInfo] = useState({})
  const [isJoin, setIsJoin] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const openClassDetail = (id: string) => {
    Taro.navigateTo({url: `/pages/class-detail/class-detail?_id=${id}`})
  }
  const bindOnSearch = async (e) => {
    try {
      // 清空搜索结果
      setClassInfo({})
      setIsSearching(false)
      Taro.showLoading({ title: SEARCHING })
      const { value } = e.detail;
      // 调用查询函数
      const { result } = await Taro.cloud.callFunction({
        name: 'class',
        data: {
          $url: "search",
          queryData: {
            token: value
          }
        }
      })
      setIsSearching(true)
      // 如果查询结果存在
      if (result && result['data'].length > 0) {
        setClassInfo(result['data'][0])
        setIsJoin(result['isJoin'])
      }
      Taro.hideLoading()
    } catch (e) {
      Taro.hideLoading()
      Taro.showToast({ title: EXPECTION })
    }
  }
  return (
    <View className='search-class'>
      <View className='page_search'>
        <NavBar
          title='搜索班级'
          back />
        <View className='search_wrap'>
          <Search autoFocus={true} hint='输入口令加入班级' onSearch={bindOnSearch} />
        </View>
        {isSearching &&
          <View>
            {classInfo['_id']
              ? <View className='search_result'>
                <Text className='title'>为你找到</Text>
                <ClassItem
                  classname={classInfo['className']}
                  totalNum={classInfo['count']}
                  joinNum={classInfo['joinUsers'].length}
                  coverImage={classInfo['classImage']}
                  isJoin={isJoin}
                  onClick={() => {openClassDetail(classInfo['_id'])}}
                />
              </View>
              : <View className='empty_container'>
                <Image className='image' src={empty} />
                <View className='empty_hint'>
                  <Text>{SEARCH_EMPTY}</Text>
                </View>
              </View>
            }
          </View>
        }
      </View>
      <View className="custom_small_ad" hidden={get(AD_HIDDEN)}>
        {/*<ad-custom unit-id="adunit-dd6051faa5b6ef48"></ad-custom>*/}
      </View>
    </View>
  )
}

export default memo(SearchClass)