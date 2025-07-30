import { createAgent, gemini } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { inngest } from "./client";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-manisha-123");
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert netjs developer. you write readable code. You write simple nextjs and snippets snippets",
      model: gemini({ model: "gemini-1.5-flash" }),
    });
    const { output } = await codeAgent.run(
     `write the following snippet: ${event.data.value}`,
    );


    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    })

    
    return { output, sandboxUrl };
  },
);
