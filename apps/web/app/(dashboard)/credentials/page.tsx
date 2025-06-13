import { GetCredentialsForUser } from "@/actions/credentials/GetCredentialsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Lock, Shield, ShieldOff,  } from "lucide-react";
import React, { Suspense } from "react";
import CreateCredentialDialog from "./_components/CreateCredentialDialog";
import DeleteCredentialDialog from "./_components/DeleteCredentialDialog";
import { Credential } from "@prisma/client";

export default function CredentialsPage() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials here.</p>
        </div>
        <CreateCredentialDialog />
      </div>
      <div className="h-full py-6 space-y-8">
        <Alert>
          <Shield className="h-4 w-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription>
            Your credentials are encrypted using a secure algorithm. Make sure
            to keep your encryption key safe.
          </AlertDescription>
        </Alert>
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <UserCredetials />
        </Suspense>
      </div>
    </div>
  );
}

async function UserCredetials() {
  const credentials = await GetCredentialsForUser();

  if (!credentials) {
    return <div>Something went wrong.</div>;
  }
  if (credentials.length === 0) {
    return (
      <Card className="w-full p-4 bg-gradient-to-t">
        <div className="flex flex-col items-center justify-between p-4 space-x-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-secondary">
            <ShieldOff size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-2 text-center">
            <p className="text-bold">No credentials created yet</p>
            <p className="text-sm text-muted-foreground">
              click here to add yours first credentials{" "}
            </p>
          <CreateCredentialDialog triggerText="Create your first credentials" />
          </div>
        </div>
      </Card>
    );
  }
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Add the type annotation here */}
        {credentials.map((credential : Credential) => (
          <Card key={credential.id} className="w-full p-4 bg-gradient-to-t from-background to-primary/10 hover:to-primary/0 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer">
            <div className="flex flex-co items-center justify-between p-4 space-x-4">
                <Lock size={80} className="stroke-primary/80 " />
              <div className="flex flex-col gap-1 text-c">
                
                <div className="flex flex-col gap-1 ">
                  <p className="font-bold">{credential.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Click here to delete your credentials
                  </p>
                 
                </div>
                <div className="flex items-center justify-between w-full mt-4">

                  <DeleteCredentialDialog name={credential.name} />
                </div>
              </div>
            </div>
          </Card>
        ))}
        
      </div>
    </div>
  );
}
