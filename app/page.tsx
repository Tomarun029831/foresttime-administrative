"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trees, Shield, Clock } from "lucide-react"
import { mockAccounts } from "@/lib/mock-data"
import { APILoginRequest, APILoginResponse } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Simple authentication check against mock data
        // const account = mockAccounts.find((acc) => acc.username === username && acc.password === password)

        const acconut: APILoginRequest = { username: username, password: password };
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(acconut)
        });
        const data: APILoginResponse = await res.json() as APILoginResponse;
        const isSuccess = data.success;

        if (isSuccess) router.push("/admin");
        else setError("ユーザー名またはパスワードが正しくありません");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                        <Trees className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-800">ForestTime</CardTitle>
                    <CardDescription>林業従事者向け勤怠管理システム</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">ユーザー名</Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="管理者ユーザー名を入力"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">パスワード</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="パスワードを入力"
                                required
                            />
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                            <Shield className="w-4 h-4 mr-2" />
                            管理者ログイン
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t">
                        <div className="text-xs text-muted-foreground text-center space-y-1">
                            <p>デモ用ログイン情報:</p>
                            <p>ユーザー名: admin</p>
                            <p>パスワード: admin123</p>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            勤怠管理
                        </div>
                        <div className="flex items-center">
                            <Shield className="w-3 h-3 mr-1" />
                            安全管理
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
