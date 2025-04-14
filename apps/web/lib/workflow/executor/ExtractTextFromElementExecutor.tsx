import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  try {
   
  const selector = environment.getInput('Selector');    
  
  if(!selector) {
    environment.log.error("Selector is not provided. Please provide a valid selector.");
    return false;
  }
  const html = environment.getInput("Html");
  if(!html) {
    environment.log.error("HTML content is not provided. Please provide a valid HTML content.");
    return false;
  }   
   const $ = cheerio.load(html);
    const element = $(selector);
    
    if (!element) {
     environment.log.error(`Element not found for selector: ${selector}`);
      return false;
    }
    const extractedText = $.text(element);
    if (!extractedText) {
      environment.log.error(`No text found for selector: ${selector}`);
      return false;
    }
    environment.setOutput("Extracted Text", extractedText);


    return true;
  } catch (error) {
    environment.log.error(`Error occurred while extracting text: ${error}`);
    return false;
  }
}
