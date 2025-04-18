interface IconProps {
    className?: string;
    onClick?: () => void;
  }
  
  const ArrowRightCircleIcon = ({ className = '', onClick }: IconProps) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        viewBox="0 0 25 25"
        className={`cursor-pointer ${className}`}
        onClick={onClick}
      >
        <path
          fill="currentColor"
          d="M15.875,3.375a12.5,12.5,0,1,1-12.5,12.5A12.5,12.5,0,0,1,15.875,3.375ZM13.267,20.749a1.164,1.164,0,0,0,0,1.641,1.146,1.146,0,0,0,.817.337,1.166,1.166,0,0,0,.823-.343l5.649-5.667a1.158,1.158,0,0,0-.036-1.6L14.787,9.367a1.16,1.16,0,1,0-1.641,1.641l4.922,4.868Z"
          transform="translate(-3.375 -3.375)"
        />
      </svg>
    );
  };
  
  export default ArrowRightCircleIcon;
  