import { format } from "date-fns/format";
import { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { fr } from "date-fns/locale";
import { on } from "events";
import { ChevronRightIcon, Code2Icon } from "lucide-react";

interface UserMessageProps {
    content: string;
}

const UserMessage = ({ content }: UserMessageProps) => {
    return (
        <div className="flex justify-end pb-4 pr-2 pl-10">
            <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] break-words">
                {content}

            </Card>
        </div>
    )
}

interface FragmentCardProps {
    fragments: Fragment;
    isActiveFragments: boolean;
    onFragmentsClick: (fragments: Fragment) => void;
};

const FragmentCard = ({
    fragments,
    isActiveFragments,
    onFragmentsClick,
}: FragmentCardProps) => {
    return (
        <button
            className={cn(
                "flex items-center gap-2 border rounded-lg bg-muted w-fit p-3 transition-colors",
                isActiveFragments &&
                    "bg-primary text-primary-foreground border-primary hover:bg-primary",
            )}
            onClick={() => onFragmentsClick(fragments)}

        >
            <Code2Icon  className="size-4 mt-0.5" />
            <div className="flex flex-col flex-1">
                <span className="text-sm font-medium">{fragments.title}</span>
                <span className="text-sm">Preview</span>
            </div>
            <div className ="flex items-center justify-center mt-0.5">
                <ChevronRightIcon className="size-4" />
            </div>
        </button>
    )

};


interface AssisrtantMessage {
    content: string;
    fragments: Fragment | null;
    createdAt: Date;
    isActiveFragments: boolean;
    onFragmentsClick: (fragments: Fragment) => void;
    type: MessageType;
}

const AssistantMessage = ({
    content,
    fragments,
    createdAt,
    isActiveFragments,
    onFragmentsClick,
    type,
}: AssisrtantMessage) => {
    return (
        <div className={cn(
            "flex flex-col group px-2 pb-4",
            type === "ERROR" && "text-red-700 dark:text-red-500",

        )}>
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={18}
                    height={18}
                    className="shrink-0"
                />
                <span className ="text-sm font-medium">Rent</span>
                <span className = "text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {format(createdAt, "MMM dd, yyyy HH:mm")}

                </span>
            </div>
            <div className="flex flex-col gap-y-4">
                <span>{content}</span>
                {fragments &&type === "RESULT" && (
                    <FragmentCard
                        fragments={fragments}
                        isActiveFragments={isActiveFragments}
                        onFragmentsClick={onFragmentsClick}
                    />
                )}
            </div>
        </div>
    )
};

interface MessageCardProps {
  content: string;
  role: MessageRole;
  fragments: Fragment | null;
  createdAt: Date;
  isActiveFragments: boolean;
  onFragmentsClick: (fragments: Fragment) => void;
  type: MessageType;
}

export const MessageCard = ({
  content,
  role,
  fragments,
  createdAt,
  isActiveFragments,
  onFragmentsClick,
  type,
}: MessageCardProps) => {
  if (role === "ASSISTANT") {
    return (
        <AssistantMessage
            content={content}
            fragments={fragments}
            createdAt={createdAt}
            isActiveFragments={isActiveFragments}
            onFragmentsClick={onFragmentsClick}
            type={type}
        />
    )
  }

  return (
    <UserMessage content={content} />
  )
};
