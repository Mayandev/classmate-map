import { View, Input, Image } from '@tarojs/components'


import './index.scss'
import searchIcon from '../../assets/icon_search.png'

/**
 * 输入框
 */
interface ISearchProps {
  hint: string          // 输入框提示文字
  onSearch?: Function   // 搜索事件
}

/**
 * 搜索框组件
 * @param props 输入框属性值
 */
function Search(props: ISearchProps) {
  const { hint } = props;
  return (
    <View className='search_container'>
      <Image className='search_icon' src={searchIcon}/>
      <Input
        className='input'
        placeholder={hint}
        placeholderClass='input_hint'
        confirm-type='search'
        
      />
    </View>
  )
}

export default Search
