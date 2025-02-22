/* eslint-disable react/prop-types */
import defaultAvatar from "../assets/default-avatar.png";

function Avatar({ size, image, altText = "User avatar" }) {
  const sizes = {
    xs: "h-8 w-8",
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-20 w-20",
    xl: "h-40 w-40",
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`relative ${sizes[size]}`}>
        <img
          src={image || defaultAvatar}
          alt={altText}
          className="rounded-full object-cover w-full h-full"
        />
      </div>
    </div>
  );
}

export default Avatar;
