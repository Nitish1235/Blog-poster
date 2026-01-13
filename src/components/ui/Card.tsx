import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "white" | "primary" | "secondary" | "accent";
    sharp?: "none" | "tl" | "tr" | "bl" | "br";
    noShadow?: boolean;
}

export const Card = ({
    children,
    variant = "white",
    sharp = "none",
    noShadow = false,
    className = "",
    ...props
}: CardProps) => {
    const baseStyles = "border-2 border-border";

    const variants = {
        white: "bg-white",
        primary: "bg-primary",
        secondary: "bg-secondary",
        accent: "bg-accent",
    };

    const corners = {
        none: "rounded-[20px]",
        tl: "rounded-[20px] rounded-tl-none",
        tr: "rounded-[20px] rounded-tr-none",
        bl: "rounded-[20px] rounded-bl-none",
        br: "rounded-[20px] rounded-br-none",
    };

    return (
        <div
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${corners[sharp]}
        ${noShadow ? "" : "hard-shadow"}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};
