"use server"

import { auth } from "@clerk/nextjs/server"

export const GetPeriods = async () => {
    const {userId} = await auth()
    if (!userId) {
        throw new Error("User not authenticated")
    }
}
