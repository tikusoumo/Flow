"use server"
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GetAvailableCredits() {
   const {userId} = await auth();
   if(!userId) {
      throw new Error("User not authenticated")
   }
   let balance = await prisma.userBalance.findUnique({
    where:{
      userId
    }
   })
   // If no balance exists, create one with 100 credits for new users
   if(!balance) {
     balance = await prisma.userBalance.create({
       data: {
         userId,
         credits: 100
       }
     });
   }
   return balance.credits
}
