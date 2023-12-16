'use client'
import React, { useMemo, createContext, useState, useContext } from 'react';

interface ChatBlockState {
    chatBlockRenderMode: string;
    setChatBlockRenderMode: React.Dispatch<React.SetStateAction<string>>;
    chatBlockTriggerRender: boolean;
    setChatBlockTriggerRender: React.Dispatch<React.SetStateAction<boolean>>;
    handleRenderChatBlock: (mode :string) => void;

    dmBlockTriggerRender: boolean;
    setDmBlockTriggerRender: React.Dispatch<React.SetStateAction<boolean>>;
    handleRenderDmBlock: () => void;
  }

export const chatBlockContext = createContext<ChatBlockState | undefined>(undefined);

export const ChatBlockProvider = ({ children } :any) => {
    const [chatBlockTriggerRender, setChatBlockTriggerRender] = useState(false);
    const [chatBlockRenderMode, setChatBlockRenderMode] = useState('chatList');
    const [dmBlockTriggerRender, setDmBlockTriggerRender] = useState(false);

    const handleRenderChatBlock = (mode :string) => {
        setChatBlockRenderMode(mode);
        if (chatBlockTriggerRender === true)
        {
            setChatBlockTriggerRender(false);
        }
        else
        {
            setChatBlockTriggerRender(true);
        }
    }

    const handleRenderDmBlock = () => {

        if (dmBlockTriggerRender === true)
        {
            setDmBlockTriggerRender(false);
        }
        else
        {
            setDmBlockTriggerRender(true);
        }
    }


    const value :ChatBlockState = useMemo(() => ({
        chatBlockRenderMode, setChatBlockRenderMode,
        chatBlockTriggerRender,setChatBlockTriggerRender,
        handleRenderChatBlock,
        dmBlockTriggerRender, setDmBlockTriggerRender,
        handleRenderDmBlock
    }), [chatBlockRenderMode, setChatBlockRenderMode,
        chatBlockTriggerRender, setChatBlockTriggerRender,
        handleRenderChatBlock,
        dmBlockTriggerRender, setDmBlockTriggerRender,
        handleRenderDmBlock])

    return (
        <chatBlockContext.Provider value={value}>
            {children}
        </chatBlockContext.Provider>
    );
};

export const useChatBlockContext = () => {
  return useContext(chatBlockContext);
};

export default ChatBlockProvider;