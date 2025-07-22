"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Database, Users, Settings } from "lucide-react"

export default function SetupPage() {
  const [setupStatus, setSetupStatus] = useState<"idle" | "running" | "success" | "error">("idle")
  const [setupMessage, setSetupMessage] = useState("")

  const runSetup = async () => {
    setSetupStatus("running")
    setSetupMessage("Setting up database...")

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setSetupStatus("success")
        setSetupMessage(data.message)
      } else {
        setSetupStatus("error")
        setSetupMessage(data.message || "Setup failed")
      }
    } catch (error) {
      setSetupStatus("error")
      setSetupMessage("Network error during setup")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <Database className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">System Setup</CardTitle>
            <CardDescription>Initialize the database and create default users for the exam system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Setup Steps */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">Database Initialization</h3>
                  <p className="text-sm text-gray-600">Create indexes and collections</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-medium">Default Users</h3>
                  <p className="text-sm text-gray-600">Create admin and sample student accounts</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Settings className="h-5 w-5 text-purple-600" />
                <div>
                  <h3 className="font-medium">System Configuration</h3>
                  <p className="text-sm text-gray-600">Configure security and performance settings</p>
                </div>
              </div>
            </div>

            {/* Setup Button */}
            <div className="text-center">
              <Button onClick={runSetup} disabled={setupStatus === "running"} size="lg" className="w-full">
                {setupStatus === "running" ? "Setting up..." : "Initialize System"}
              </Button>
            </div>

            {/* Status Message */}
            {setupMessage && (
              <div
                className={`flex items-center gap-2 p-4 rounded-lg ${
                  setupStatus === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : setupStatus === "error"
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : "bg-blue-50 text-blue-800 border border-blue-200"
                }`}
              >
                {setupStatus === "success" && <CheckCircle className="h-5 w-5" />}
                {setupStatus === "error" && <AlertCircle className="h-5 w-5" />}
                <span>{setupMessage}</span>
              </div>
            )}

            {/* Default Credentials */}
            {setupStatus === "success" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Default Login Credentials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm">Teacher Account</h4>
                    <p className="text-sm text-gray-600">Username: admin</p>
                    <p className="text-sm text-gray-600">Password: admin123</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm">Student Accounts</h4>
                    <p className="text-sm text-gray-600">student1 / student123 (ID: STU001)</p>
                    <p className="text-sm text-gray-600">student2 / student123 (ID: STU002)</p>
                    <p className="text-sm text-gray-600">student3 / student123 (ID: STU003)</p>
                  </div>
                  <div className="text-center pt-4">
                    <Button asChild>
                      <a href="/">Go to Login Page</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
