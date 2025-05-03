import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJsonTask } from "../../task/dataStorage/ReadPropertyFromJson";

export async function ReadPropertFromJsonExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>
): Promise<boolean> {
  try {
   
   const  jsonData = environment.getInput('JSON') as string;
   if (!jsonData) {
     environment.log.error("JSON is required");
    }
   
   const  propertyName = environment.getInput('Property Name') as string;
   if (!propertyName) {
     environment.log.error("Property Name is required");
     return false;
   }

   const json = JSON.parse(jsonData);
   const propertyValue = json[propertyName];
   if (propertyValue === undefined) {
     environment.log.error(`Property '${propertyName}' not found in JSON`);
     return false;
   }
    environment.setOutput("Property Value", propertyValue);

   return true;
  } catch (error) {
    environment.log.error(`Error occurred while extracting HTML: ${error}`);
    return false;
  }
}
