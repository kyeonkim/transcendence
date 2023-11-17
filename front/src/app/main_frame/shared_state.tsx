
'use client'
import { memo, useMemo, createContext, useState, useContext } from 'react';

interface ChatBlockState {
    chatBlockRenderMode: string;
    setChatBlockRenderMode: React.Dispatch<React.SetStateAction<string>>;
    chatBlockTriggerRender: boolean;
    setChatBlockTriggerRender: React.Dispatch<React.SetStateAction<boolean>>;
    handleRenderChatBlock: (mode :string) => void;
  }

export const chatBlockContext = createContext<ChatBlockState | undefined>(undefined);

export const ChatBlockProvider = ({ children } :any) => {
    const [chatBlockTriggerRender, setChatBlockTriggerRender] = useState(false);
    const [chatBlockRenderMode, setChatBlockRenderMode] = useState('chatList');

    const handleRenderChatBlock = (mode :string) => {
        setChatBlockRenderMode(mode);
        setChatBlockTriggerRender(true);
    }

    const value :ChatBlockState = useMemo(() => ({
        chatBlockRenderMode,
        setChatBlockRenderMode,
        chatBlockTriggerRender,
        setChatBlockTriggerRender,
        handleRenderChatBlock
    }), [chatBlockRenderMode, setChatBlockRenderMode,
        chatBlockTriggerRender, setChatBlockTriggerRender,
        handleRenderChatBlock])


    // const value = useMemo(() => ({
    //     chatBlockRenderMode,
    //     setChatBlockRenderMode,
    // }), [chatBlockRenderMode, setChatBlockRenderMode])

    return (
        <chatBlockContext.Provider value={value}>
            {children}
        </chatBlockContext.Provider>
    );

    // return (
    //      <chatBlockContext.Provider value={{chatBlockRenderMode, setChatBlockRenderMode}}>
    //         {children}
    //      </chatBlockContext.Provider>
    // );
};

export const useChatBlockContext = () => {
  return useContext(chatBlockContext);
};

export default ChatBlockProvider;