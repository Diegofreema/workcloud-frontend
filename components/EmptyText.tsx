import { MyText } from './Ui/MyText';

type Props = {
  text: string;
};

export const EmptyText = ({ text }: Props): JSX.Element => {
  return (
    <MyText
      poppins="Medium"
      style={{
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
      }}
    >
      {text}
    </MyText>
  );
};
