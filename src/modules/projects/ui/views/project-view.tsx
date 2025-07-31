"use client";
import { useState, useEffect } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ProjectHeader } from "../components/project-header";
import { MessagesContainer } from "../components/message-container";
import { Suspense } from "react";
import { Fragment } from "@/generated/prisma";
import { FragmentWeb } from "../components/fragment-web";



interface Props {
  projectId: string;
  

}

export const ProjectView = ({ projectId }: Props) => {
    const [activeFragements, setActiveFragements] = useState<Fragment | null>(null);
  

  
  return (
    <div className="h-screen">
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
                defaultSize={35}
                minSize={20}
                className="flex flex-col min-h-0"
            >
                <Suspense fallback= {<p>Loading Project...</p>}>
                    <ProjectHeader projectId={projectId} />

                </Suspense>
                
                <Suspense fallback={<p>Loading messages...</p>}>

                    <MessagesContainer
                        projectId={projectId}
                        activeFragments={activeFragements}
                        setActiveFragments={setActiveFragements}
                    
                    />
                </Suspense>
            </ResizablePanel>

            <ResizableHandle withHandle />

                
            
            <ResizablePanel
                defaultSize={65}
                minSize={20}
            >
                {!!activeFragements && <FragmentWeb data={activeFragements} />}
                
            </ResizablePanel>
        </ResizablePanelGroup>
        
        
    </div>
  );
}
