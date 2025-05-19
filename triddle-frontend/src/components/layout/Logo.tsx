import { FileText } from "lucide-react";
import Link from "next/link";

interface LogoProps {
    size?: "small" | "medium" | "large";
    href?: string;
}

export default function Logo({ size = "medium", href = "/" }: LogoProps) {
    const sizeClasses = {
        small: "text-sm",
        medium: "text-base",
        large: "text-3xl",
    };

    const content = (
        <div className="flex items-center space-x-2">
            <FileText className={`text-primary ${size === "small" ? "w-5 h-5" : size === "medium" ? "w-6 h-6" : "w-8 h-8"}`} />
            <span className={`font-bold ${sizeClasses[size]}`}>Triddle</span>
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
}
