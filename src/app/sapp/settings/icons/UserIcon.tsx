interface IconProps {
    className?: string;
    onClick?: () => void;
  }
  
  const UserIcon = ({ className = '', onClick }: IconProps) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17.561"
        height="20.07"
        viewBox="0 0 17.561 20.07"
        className={`cursor-pointer ${className}`}
        onClick={onClick}
      >
        <path
          fill="currentColor"
          d="M8.781,10.035A5.017,5.017,0,1,0,3.763,5.017,5.017,5.017,0,0,0,8.781,10.035Zm3.512,1.254h-.655a6.824,6.824,0,0,1-5.715,0H5.268A5.27,5.27,0,0,0,0,16.558v1.631A1.882,1.882,0,0,0,1.882,20.07h13.8a1.882,1.882,0,0,0,1.882-1.882V16.558A5.27,5.27,0,0,0,12.293,11.289Z"
        />
      </svg>
    );
  };
  
  export default UserIcon;
  