import React, { ReactNode, useEffect, useState } from 'react';

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade' | 'slide-up' | 'slide-right' | 'scale';
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className = '',
  delay = 0,
  animation = 'fade'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade':
        return 'fade-in';
      case 'slide-up':
        return 'slide-in-up';
      case 'slide-right':
        return 'slide-in-right';
      case 'scale':
        return 'scale-in';
      default:
        return 'fade-in';
    }
  };

  return (
    <div 
      className={`${className} ${getAnimationClass()} ${isVisible ? 'visible' : 'invisible opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
