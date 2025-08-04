import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { MessageForm } from "./message-form"
import { MessageCard } from "./message-card";
import { useEffect, useRef } from "react";
import { Fragment } from "@/generated/prisma";
import { set } from "date-fns";
import { MessageLoading } from "./message-loading";
import { lastAssistantTextMessageContent } from "@/inngest/utils";
interface Props {
  projectId: string;
  activeFragments: Fragment | null;
    setActiveFragments: (fragments: Fragment | null) => void;
};

export const MessagesContainer = ({ 
    projectId,
    activeFragments,
    setActiveFragments, 
}: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();
  const lastAssistantMessageIDRef = useRef<string | null>(null);

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({
      projectId: projectId,
    },{
        //TODO : temporary live message update
        refetchInterval: 5000,
    })
  );

   useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.role === "ASSISTANT"
    );
    if (
      lastAssistantMessage?.fragments &&
      lastAssistantMessage.id !== lastAssistantMessageIDRef.current
    ) {
      setActiveFragments(lastAssistantMessage.fragments);
      lastAssistantMessageIDRef.current = lastAssistantMessage.id;
    }
     
   }, [messages, setActiveFragments]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();

  }, [messages.length]);

  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage?.role === "USER";
  

  return (
    <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto">
            <div className="pt-2 pr-1">
                {messages.map((message) => (
                    <MessageCard 
                        key={message.id}
                        content={message.content}
                        role={message.role}
                        fragments={message.fragments}
                        createdAt={message.createdAt}
                        isActiveFragments={activeFragments?.id === message.fragments?.id}
                        onFragmentsClick={() => setActiveFragments(message.fragments)}
                        type={message.type}
                    />
                ))}
                {isLastMessageUser && <MessageLoading />}
                <div ref={bottomRef} />
            </div>
        </div> 
        <div className="relative p-3 pt-1">
            <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none"/>
            <MessageForm projectId={projectId} />

            
            
        </div>
    </div>
  );
};
