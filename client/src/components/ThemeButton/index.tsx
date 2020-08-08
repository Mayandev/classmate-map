import { Button, View } from "@tarojs/components"

interface IThemeButtonProps {
  text: string  
}
function ThemeButton(props: IThemeButtonProps) {
  const { text } = props;
  return (
    <View className='theme_button'>
      <Button>{text}</Button>
    </View>
  )
}

export default ThemeButton;