"use client"

import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Activity,
    MapPin,
    Clock,
    Users,
    Wrench,
    FileText,
    CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItem {
    href: string
    label: string
    icon: React.ElementType
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    const navItems: NavItem[] = [
        { href: "/admin", label: "概要", icon: Activity },
        { href: "/admin/workareas", label: "作業エリア管理", icon: MapPin },
        { href: "/admin/attendance", label: "勤怠監視", icon: Clock },
        { href: "/admin/employees", label: "従業員管理", icon: Users },
        { href: "/admin/tasks", label: "タスク管理", icon: CheckCircle },
        { href: "/admin/tools", label: "道具管理", icon: Wrench },
        { href: "/admin/reports", label: "日報", icon: FileText },
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex gap-6">
                {/* Sidebar Navigation */}
                <aside className="w-64 space-y-2">
                    <Card>
                        <CardContent className="p-4">
                            <nav className="space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon
                                    const isActive = pathname === item.href
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <Button
                                                variant={isActive ? "default" : "ghost"}
                                                className={`w-full justify-start ${isActive
                                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                                    : "hover:bg-green-50"
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4 mr-3" />
                                                {item.label}
                                            </Button>
                                        </Link>
                                    )
                                })}
                            </nav>
                        </CardContent>
                    </Card>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <Card>
                        <CardContent className="p-6">{children}</CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}
