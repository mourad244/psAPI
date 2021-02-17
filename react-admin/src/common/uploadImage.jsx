import React from "react";

const UploadImage = ({ name, label, image, height, type, ...rest }) => {
  return (
    <div>
      <h2>{label}</h2>
      <img src={image} height={height + "px"} />
      <input {...rest} type={type} name={name} />
    </div>
  );
};

export default UploadImage;
