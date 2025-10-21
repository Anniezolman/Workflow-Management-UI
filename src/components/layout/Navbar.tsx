import { Zap } from "lucide-react"
import Link from "next/link"

export function Navbar() {
    return (
        <nav className="border-b border-border bg-background sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
                    <Zap className="w-6 h-6 text-blue-600" />
                    <span>WorkflowBuilder</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Projects
                    </Link>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Documentation
                    </a>
                </div>
            </div>
        </nav>
    )
}