import { memo, useEffect, showLoading, hideLoading, useState, useDidShow } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components"
import NavBar from 'taro-navigationbar'

import './class-manage.scss'
import { manageList } from "@/utils/request/manageClass";
import { showToast } from '@/utils/utils';
import { LOADING, EXPECTION } from '@/constants/toast';
import ClassItem from "@/components/ClassItem";
// resource
import empty from '../../assets/illustration_empty.png'
import { CREATE_CLASS } from '@/constants/page';
import { ActionType, AD_HIDDEN } from '@/constants/data';
import { get } from "@/utils/globaldata";




function ClassManage() {

  const [createClasses, setCreateClasses] = useState([])

  const fetchData = async () => {
    showLoading({ title: LOADING })
    try {
      const result = await manageList()
      console.log(result);

      if (result && result['classList']['data']) {
        setCreateClasses(result['classList']['data'])
      }
      hideLoading()
    } catch (e) {
      showToast(EXPECTION)
    }
  }

  const classItemsDom = createClasses.map((item, index) => {
    return (

      <ClassItem
        onClick={() => { Taro.navigateTo({ url: `${CREATE_CLASS}?action=${ActionType.UPDATE}&_id=${item['_id']}` }) }}
        // onLongPress={() => { handleQuitClass(item['_id']) }}
        classname={item['className']}
        totalNum={item['count']}
        joinNum={item['joinUsers']['length']}
        coverImage={item['classImage']}
        isJoin={true}
      />
    )
  })

  useDidShow(() => {
    fetchData()
  })

  return (
    <View className='attention_page'>
      <NavBar back title={'班级管理'} />
      <View className="page">
        <View className="ad_unit" hidden={get(AD_HIDDEN)}>
          {/*<ad-custom unit-id="adunit-f490192041c3b170"></ad-custom>*/}
        </View>
        <View className='item_container'>
          {
            createClasses.length === 0
              ? (
                <View className='empty_container'>
                  <Image className='image' src={empty} />
                  <View className='empty_hint'>
                    <Text>您还没加入任何班级</Text>
                  </View>
                </View>
              )
              : classItemsDom
          }
        </View>
      </View>
      <View className="custom_small_ad" hidden={get(AD_HIDDEN)}>
        {/*<ad-custom unit-id="adunit-dae90770d3103677"></ad-custom>*/}
      </View>
    </View>
  )
}

export default memo(ClassManage)