import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAITask } from "../task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import Openai from "openai";

export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials") as string;
    if (!credentials) {
      environment.log.error("Credentials are required");
    }
    const prompt = environment.getInput("Prompt") as string;
    if (!prompt) {
      environment.log.error("Credentials are required");
    }
    const content = environment.getInput("Content") as string;
    if (!content) {
      environment.log.error("Credentials are required");
    }

    //Get the credentials from the DB
    const credential = await prisma.credential.findUnique({
      where: {
        id: credentials,
      },
    });

    if (!credential) {
      environment.log.error("Credentials not found in the database");
      return false;
    }

    const plainCredentials = symmetricDecrypt(credential.value);
    if (!plainCredentials) {
      environment.log.error("Can not decrypt credentials");
      return false;
    }


    const openai = new Openai({
      apiKey: plainCredentials,
      baseURL: "https://openrouter.ai/api/v1"
    });
    

    const response = await openai.chat.completions.create({
      model: 'qwen/qwen3-14b:free',
      messages: [
        {
          role: 'system',
          content: "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML contentas input and also the prompt with the data you have to extract. The response should always be only the extracted dataas a JSON array or object, without any additional words ok explanations. Analyze the input carefully and extract dataprecisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided contentand ensure the output is always a valid JSON array without any surrounding text",
        },

        {
          role: 'user',
          content: content,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 1,
    })
    environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
    environment.log.info(`Completetion tokens: ${response.usage?.prompt_tokens}`);

    const result = response.choices[0].message.content;
    if (!result) {
      environment.log.error("No result found in AI the response");
      return false;
    }
    

    // const mockExtractedData = {
    //   usernameSelector:"#username",
    //   passwordSelector:"#password",
    //   loginSelector: "body > div > div > div > div > form > button",
    // }
    // environment.setOutput("Extracted data", JSON.stringify(mockExtractedData));
    environment.setOutput("Extracted data", result);
    
    return true;
  } catch (error) {
    environment.log.error(`Error occurred while extracting HTML: ${error}`);
    return false;
  }
}
