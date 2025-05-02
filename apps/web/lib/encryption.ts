import crypto from "crypto"
import "server-only"
const ALG ="aes-256-cbc" 
export const symmetricEncrypt = (data:string)=>{
        const key = process.env.ENCRYPTION_KEY
        if(!key){
            throw new Error("Encryption key not found")

        }
        //initialization vector
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALG, Buffer.from(key, 'hex'), iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv.toString('hex'), encryptedData: encrypted };
}

export const symmetricDecrypt = ( jsonData:string)=>{
    const key = process.env.ENCRYPTION_KEY
    if(!key){
        throw new Error("Encryption key not found")

    }

    try {
        // 1. Parse the JSON string from the database
        const parsedData = JSON.parse(jsonData);

        // 2. Validate the parsed structure
        if (!parsedData.iv || typeof parsedData.iv !== 'string' || !parsedData.encryptedData) {
             throw new Error("Invalid encrypted data format: Missing iv or encryptedData");
        }

        // 3. Extract IV and convert from hex
        const iv = Buffer.from(parsedData.iv, 'hex');

        // 4. Extract encrypted data buffer (handle JSON stringify's Buffer representation)
        let encryptedText: Buffer;
        if (typeof parsedData.encryptedData === 'object' && parsedData.encryptedData.type === 'Buffer' && Array.isArray(parsedData.encryptedData.data)) {
            encryptedText = Buffer.from(parsedData.encryptedData.data);
        } else {
            // Add fallback or stricter error if needed, but this handles the common case
            throw new Error("Invalid encrypted data format: encryptedData is not in expected Buffer structure");
        }

        // 5. Perform decryption
        const decipher = crypto.createDecipheriv(ALG, Buffer.from(key, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();

    } catch (error) {
        // Catch JSON parsing errors or other issues during decryption
        console.error("Decryption failed:", error);
        // Re-throw or handle appropriately
        if (error instanceof SyntaxError) {
            throw new Error("Failed to parse stored encrypted data. Invalid JSON.");
        }
         // The original error might be useful, like the IV error if hex conversion fails
        throw new Error(`Decryption process failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}