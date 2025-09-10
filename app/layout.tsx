import './globals.css'
export const metadata = {
    title: "ForestTime",
    description: "管理システム",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja">
            <body>
                {children}
            </body>
        </html>
    )
}
