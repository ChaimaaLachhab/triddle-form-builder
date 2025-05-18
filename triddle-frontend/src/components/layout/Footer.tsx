import Logo from "./Logo";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <Logo size="small" />
                        <p className="mt-4 text-sm text-gray-600">
                            Create beautiful forms in minutes with our easy-to-use form builder.
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="font-medium mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/features" className="text-sm text-gray-600 hover:text-primary transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-sm text-gray-600 hover:text-primary transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/templates" className="text-sm text-gray-600 hover:text-primary transition-colors">
                                    Templates
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="font-medium mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/help" className="text-sm text-gray-600 hover:text-primary transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/guides" className="text-sm text-gray-600 hover:text-primary transition-colors">
                                    Guides
                                </Link>
                            </li>
                            <li>
                                <Link href="/api" className="text-sm text-gray-600 hover:text-primary transition-colors">
                                    API
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="font-medium mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-sm text-gray-600 hover:text-primary transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-gray-600 hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary transition-colors">
                                    Privacy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-600">© Form Builder, 2025. All Rights Reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/terms" className="text-sm text-gray-600 hover:text-primary transition-colors">
                            Terms
                        </Link>
                        <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary transition-colors">
                            Privacy
                        </Link>
                        <Link href="/cookies" className="text-sm text-gray-600 hover:text-primary transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
