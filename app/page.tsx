"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, BookOpen, Monitor } from "lucide-react"

export default function HomePage() {
  const [loginData, setLoginData] = useState({ username: "", password: "", role: "student" })
  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    studentId: "",
    role: "student",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        if (data.user.role === "teacher") {
          window.location.href = "/teacher/dashboard"
        } else {
          window.location.href = "/student/dashboard"
        }
      } else {
        alert(data.message || "Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login error. Please try again.")
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Account created successfully! Please login.")
        setSignupData({ username: "", password: "", confirmPassword: "", fullName: "", studentId: "", role: "student" })
      } else {
        alert(data.message || "Signup failed")
      }
    } catch (error) {
      console.error("Signup error:", error)
      alert("Signup error. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Smart Exam without Internet</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">Offline LAN-Based Examination System</p>
          <p className="text-sm text-gray-500">Secure • Offline • Professional</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Secure Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Protected login system with role-based access control</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Monitor className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Offline Operation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Works entirely on local network without internet</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Real-time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Live submission monitoring and result analysis</p>
            </CardContent>
          </Card>
        </div>

        {/* Login/Signup Forms */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Access System</CardTitle>
            <CardDescription className="text-center">Login to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-role">Role</Label>
                    <select
                      id="login-role"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={loginData.role}
                      onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullname">Full Name</Label>
                    <Input
                      id="signup-fullname"
                      type="text"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-studentid">Student ID</Label>
                    <Input
                      id="signup-studentid"
                      type="text"
                      value={signupData.studentId}
                      onChange={(e) => setSignupData({ ...signupData, studentId: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      value={signupData.username}
                      onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="max-w-md mx-auto mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Demo Credentials</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div>
              <strong>Teacher:</strong> admin / admin123
            </div>
            <div>
              <strong>Student:</strong> student1 / student123
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
