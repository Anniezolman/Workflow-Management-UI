export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/30 mt-16">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href="#" className="hover:text-foreground transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground transition-colors">
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground transition-colors">
                                    Templates
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href="#" className="hover:text-foreground transition-colors">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground transition-colors">
                                    Guides
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground transition-colors">
                                    API
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href="#" className="hover:text-foreground transition-colors">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href="#" className="hover:text-foreground transition-colors">
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground transition-colors">
                                    Terms
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground transition-colors">
                                    License
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>&copy; 2025 WorkflowBuilder. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-foreground transition-colors">
                            Twitter
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            GitHub
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}