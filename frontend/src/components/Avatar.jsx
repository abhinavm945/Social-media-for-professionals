/* eslint-disable react/prop-types */

function Avatar({ size, image, altText = "User avatar" }) {
  const sizes = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14",
    xl: "h-20 w-20",
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`relative ${sizes[size]}`}>
        <img
          src={image || "/default-avatar.png"} 
          alt={altText}
          className="rounded-full object-cover w-full h-full"
        />
      </div>
    </div>
  );
}

export default Avatar;
