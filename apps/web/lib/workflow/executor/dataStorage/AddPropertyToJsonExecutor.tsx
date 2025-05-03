import { ExecutionEnvironment } from "@/types/executor";
import { AddPropertyToJsonTask } from "../../task/dataStorage/AddPropertyToJson";

export async function AddPropertToJsonExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>
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
   const  propertyValue = environment.getInput('Property Value') as string;
   if (!propertyName) {
     environment.log.error("Property Name is required");
     return false;
   }

   const json = JSON.parse(jsonData);
   json[propertyName] = propertyValue;
  
    environment.setOutput("Updated JSON", JSON.stringify(json, null, 2));

   return true;
  } catch (error) {
    environment.log.error(`Error occurred while extracting HTML: ${error}`);
    return false;
  }
}
