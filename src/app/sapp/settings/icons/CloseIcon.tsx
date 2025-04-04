interface IconProps {
    className?: string;
    onClick?: () => void;
  }
  
  const CloseIcon = ({ className = '', onClick }: IconProps) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36.152"
        height="36.152"
        viewBox="0 0 36.152 36.152"
        className={`h-10 w-10 cursor-pointer ${className}`}
        onClick={onClick}
      >
        <path
          fill="currentColor"
          d="M21.451,3.375A18.076,18.076,0,1,0,39.527,21.451,18.073,18.073,0,0,0,21.451,3.375Zm4.58,24.62-4.58-4.58-4.58,4.58a1.389,1.389,0,1,1-1.964-1.964l4.58-4.58-4.58-4.58a1.389,1.389,0,0,1,1.964-1.964l4.58,4.58,4.58-4.58a1.389,1.389,0,0,1,1.964,1.964l-4.58,4.58,4.58,4.58a1.4,1.4,0,0,1,0,1.964A1.38,1.38,0,0,1,26.031,27.995Z"
          transform="translate(-3.375 -3.375)"
        />
      </svg>
    );
  };
  
  export default CloseIcon;
  