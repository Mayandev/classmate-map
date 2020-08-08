import { View, Input, Image } from '@tarojs/components'


import './index.scss'
import searchIcon from '../../assets/icon_search.png'
import { CommonEventFunction } from '@tarojs/components/types/common';

/**
 * 输入框
 */
interface ISearchProps {
  hint: string          // 输入框提示文字
  onSearch?: CommonEventFunction   // 搜索事件
  autoFocus: boolean
}

/**
 * 搜索框组件
 * @param props 输入框属性值
 */
function Search(props: ISearchProps) {
  const { hint, onSearch, autoFocus } = props;
  return (
    <View className='search_container'>
      <Image className='search_icon' src={searchIcon}/>
      <Input cursor-spacing={5}
        className='input'
        placeholder={hint}
        placeholderClass='input_hint'
        confirm-type='search'
        autoFocus={autoFocus}
        onConfirm={onSearch ? onSearch : () => {}}
      />
    </View>
  )
}

export default Search
