interface IconProps {
    className?: string;
    onClick?: () => void;
  }
  
  const ArrowLeftIcon = ({ className = '', onClick }: IconProps) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 36 36"
        className={`h-10 w-10 cursor-pointer ${className}`}
        onClick={onClick}
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M18,36A18,18,0,1,0,0,18A18,18,0,0,0,18,36Zm.055-22.445a1.35,1.35,0,0,0-1.909-1.909l-5.4,5.4a1.35,1.35,0,0,0,0,1.909l5.4,5.4a1.35,1.35,0,0,0,1.909-1.909l-3.1-3.1h9.7a1.35,1.35,0,0,0,0-2.7h-9.7Z"
        />
      </svg>
    );
  };
  
  export default ArrowLeftIcon;
  