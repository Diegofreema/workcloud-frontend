import { StreamChat } from 'stream-chat';

const apiKey = 'cnvc46pm8uq9';
const apiSecret =
  '4e4zqvk5ntasfevbnegfj2gn4yuf7sbsayutarfufrpcbgx8s7nenb84ns64jbgt';

const serverClient = StreamChat.getInstance(apiKey, apiSecret);
export const handler = async (event) => {
  const token = serverClient.createToken(event.body);
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};

console.log('Hello from Lambda!', await handler());
