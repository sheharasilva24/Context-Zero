import React, { ButtonHTMLAttributes, useState } from 'react';

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

const RippleButton: React.FC<RippleButtonProps> = ({
  className = '',
  children,
  ...props
}) => {
  const [rippleStyle, setRippleStyle] = useState<React.CSSProperties>({});
  const [rippleActive, setRippleActive] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    setRippleStyle({
      width: `${size}px`,
      height: `${size}px`,
      top: `${y}px`,
      left: `${x}px`
    });
    
    setRippleActive(true);
    
    setTimeout(() => {
      setRippleActive(false);
    }, 600);
    
    if (props.onClick) props.onClick(e);
  };

  return (
    <button
      {...props}
      className={`relative overflow-hidden transition-all duration-200 ${className}`}
      onClick={handleClick}
    >
      {children}
      {rippleActive && (
        <span
          className="absolute rounded-full bg-white opacity-25 transform scale-0 animate-ripple"
          style={rippleStyle}
        />
      )}
    </button>
  );
};

export default RippleButton;
