"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function AccountSettings() {
  const [name, setName] = useState("Pietro Schirano")
  const [username, setUsername] = useState("@skirano")

  const handleSave = () => {
    // Here you would typically send the updated data to your backend
    console.log("Saving changes:", { name, username })
  }

  return (
    <div className="w-full max-w-[400px] mx-auto space-y-4">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          <TabsTrigger value="account" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            Account
          </TabsTrigger>
          <TabsTrigger value="password" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            Password
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card className="mt-4">
            <CardContent className="pt-4">
              <div className="space-y-4">
                <p className="text-gray-500 text-sm">
                  Make changes to your account here. Click save when you're done.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-gray-200"
                  />
                </div>
                <div className="flex justify-start">
                  <Button 
                    onClick={handleSave} 
                    className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2"
                  >
                    Save changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
        <Card className="mt-4">
            <CardContent className="pt-4">
              <div className="space-y-4">
                <p className="text-gray-500 text-sm">
                  Make changes to your account here. Click save when you're done.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-gray-200"
                  />
                </div>
                <div className="flex justify-start">
                  <Button 
                    onClick={handleSave} 
                    className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2"
                  >
                    Save changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}