import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className = "", showText = true, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-14 h-14",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <Link 
      href="/" 
      className={`inline-flex items-center gap-2 md:gap-3 group ${className}`}
      style={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center' }}
    >
      {/* Modern Logo Icon - Ultra Clean Design */}
      <div 
        className={`${sizeClasses[size]} relative flex items-center justify-center flex-shrink-0`}
        style={{ display: 'block' }}
      >
        {/* Background square with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-lg border-2 border-black hard-shadow-sm transform group-hover:scale-105 transition-all duration-300"></div>
        
        {/* Modern minimalist design - Bold checkmark with upward arrow */}
        <svg
          className="absolute inset-0 w-full h-full p-2.5"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bold checkmark - represents "correct choice" */}
          <path
            d="M10 20 L16 26 L30 12"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Upward arrow - represents "better" - positioned at top right */}
          <path
            d="M28 8 L28 12 M26 10 L28 8 L30 10"
            stroke="black"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Logo Text - Right side of icon, horizontally aligned */}
      {showText && (
        <span 
          className={`${textSizes[size]} font-black uppercase tracking-tight group-hover:text-primary transition-colors whitespace-nowrap`}
          style={{ 
            display: 'inline-block',
            lineHeight: '1',
            verticalAlign: 'middle'
          }}
        >
          PickBettr
        </span>
      )}
    </Link>
  );
};
