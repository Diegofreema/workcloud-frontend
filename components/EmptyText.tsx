import { useWindowDimensions } from 'react-native';
import { MyText } from './Ui/MyText';

type Props = {
  text: string;
};

export const EmptyText = ({ text }: Props): JSX.Element => {
  const { width } = useWindowDimensions();
  return (
    <MyText
      poppins="Medium"
      style={{
        textAlign: 'center',
        marginTop: 10,
        fontSize: 20,
        textAlignVertical: 'center',
        width: width * 0.9,
      }}
    >
      {text}
    </MyText>
  );
};
