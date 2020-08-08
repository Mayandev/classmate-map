import { View, Image, Button, Input, Form } from "@tarojs/components"

import './index.scss'
import close from '../../assets/icon_close.png'
import { CommonEventFunction } from '@tarojs/components/types/common';
import { memo } from "@tarojs/taro";

interface IAuthModalProps {
  onClose: Function   // 关闭事件
  onCheck: CommonEventFunction   // 检查口令
}

function TokenModal(props: IAuthModalProps) {

  const { onClose, onCheck } = props

  // 防止滚动穿透
  const handleTouchMove = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
  }


  return (
    <View className='auth_modal' onTouchMove={handleTouchMove}>
      <View className='modal_container'>
        <View className='modal_title'>班级口令</View>
        <Form onSubmit={onCheck}>
          <Input cursor-spacing={5}
            className='form_input'
            placeholder='请输入口令'
            placeholderClass='placeholder'
            autoFocus
            name='token' />
          <Button
            hoverClass='check_btn_hover'
            className='check_btn'
            formType='submit'>确认口令</Button>
        </Form>
        <View className='modal_close' onClick={() => { onClose() }}>
          <Image className='close_icon' src={close}></Image>
        </View>
      </View>
      <View className='modal_mask'></View>
    </View>
  )
}

export default memo(TokenModal)

