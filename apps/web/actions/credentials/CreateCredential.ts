"use server"

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { CreateCredentialSchema, CreateCredentialSchemaType } from "@/schema/credentials"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export async function CreateCredentials(form: CreateCredentialSchemaType) {

    const { success, data } = CreateCredentialSchema.safeParse(form)

    if (!success) {
        throw new Error(`Invalid data`);
    }

    const {userId} = await auth()
    if (!userId) {
        throw new Error("User not authenticated")
    }

    //Encrypt value
    const encryptedValue = symmetricEncrypt(data.value);
    
    // Convert encrypted object to JSON string for storage

    const encryptedValueString = JSON.stringify(encryptedValue);
    
   
    
    const result = await prisma.credential.create({
        data: {
            name: data.name,
            value: encryptedValueString,
            userId: userId,
        },
    })
    if(!result) {
        throw new Error("Error creating credential")
    }

    revalidatePath("/credentials")
}

