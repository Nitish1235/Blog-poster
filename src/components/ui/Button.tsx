import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "accent" | "outline";
    size?: "sm" | "md" | "lg";
    sharp?: "none" | "tl" | "tr" | "bl" | "br" | "all";
    fullWidth?: boolean;
}

export const Button = ({
    children,
    variant = "primary",
    size = "md",
    sharp = "none",
    fullWidth = false,
    className = "",
    ...props
}: ButtonProps) => {
    const baseStyles =
        "inline-flex items-center justify-center font-bold uppercase border-2 border-border transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus:outline-none";

    const variants = {
        primary: "bg-primary text-black hover:bg-yellow-400 hard-shadow",
        secondary: "bg-secondary text-black hover:bg-teal-300 hard-shadow",
        accent: "bg-accent text-black hover:bg-green-300 hard-shadow",
        outline: "bg-white text-black hover:bg-gray-50 hard-shadow",
    };

    const sizes = {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-base",
        lg: "h-14 px-8 text-lg",
    };

    const corners = {
        none: "rounded-[10px]",
        tl: "rounded-[10px] rounded-tl-none",
        tr: "rounded-[10px] rounded-tr-none",
        bl: "rounded-[10px] rounded-bl-none",
        br: "rounded-[10px] rounded-br-none",
        all: "rounded-none",
    };

    return (
        <button
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${corners[sharp]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
};
