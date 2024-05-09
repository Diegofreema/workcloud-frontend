import React, { useState } from 'react';
import { ChannelProps } from 'stream-chat-expo';

export const AppContext = React.createContext({
  channel: null,
  setChannel: (channel: any) => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [channel, setChannel] = useState(null);

  return (
    <AppContext.Provider value={{ channel, setChannel }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => React.useContext(AppContext);
