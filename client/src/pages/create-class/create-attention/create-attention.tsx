import { memo } from "@tarojs/taro";
import { View, Image } from "@tarojs/components"
import NavBar from 'taro-navigationbar'

import './create-attention.scss'
import create_attention from '../../../assets/illustration_create_attention_list.png'
import { get } from "@/utils/globaldata";
import { AD_HIDDEN } from "@/constants/data";

function CreateAttention() {
  const AttentionData = [
    '1、班级名应该有具体含义，可以使用学校+班级名的形式，例如 "华中大152021班"。',
    '2、创建人可以使用自己的姓名或者常用昵称。',
    '3、口令尽量复杂，防止无关人员加入班级。',
    '4、勾选允许被搜索后，班级可以通过口令搜索加入。',
    '5、请勿上传任何违法违规内容，若经查处，将冻结账号，并移送信息至有关部门。',
    '6、「同学在哪儿」小程序保留一切解释权。'
  ]
  return (
    <View className='attention_page'>
      <NavBar back title={'创建规范'} />
      <View className='image_container'>
        <Image mode='widthFix' src={create_attention} className='attention_image' />
      </View>
      <View className='item_container'>

        {AttentionData.map(item => {
          return (
            <View className='attention_item'>
              {item}
            </View>
          )
        })}
      </View>
      <View className="custom_small_ad" hidden={get(AD_HIDDEN)}>
        {/*<ad-custom unit-id="adunit-e50ac71dbff09edd"></ad-custom>*/}
      </View>
    </View>
  )
}

export default memo(CreateAttention)