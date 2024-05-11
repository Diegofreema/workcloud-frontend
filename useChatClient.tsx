// useChatClient.js

import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { chatApiKey } from './chatConfig';
import { useData } from './hooks/useData';

const chatClient = StreamChat.getInstance(chatApiKey);

export const useChatClient = () => {
  const { user } = useData();
  const userData = {
    id: user?.id as string,
    name: user?.name,
    image: user?.avatarUrl,
  };

  const [clientIsReady, setClientIsReady] = useState(false);
  useEffect(() => {
    const setupClient = async () => {
      try {
        chatClient.connectUser(userData, user?.streamToken);
        setClientIsReady(true);
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `An error occurred while connecting the user: ${error.message}`
          );
        }
      }
    };

    // If the chat client has a value in the field `userID`, a user is already connected
    // and we can skip trying to connect the user again.
    if (!chatClient.userID) {
      setupClient();
    }
  }, []);
  return {
    clientIsReady,
  };
};
