import React from "react";

const UploadImage = ({ name, label, image, height, type, ...rest }) => {
  return (
    <div className="form-group form-row">
      <label
        className="col-md-2 col-form-label text-md  align-self-center"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="col-md-10">
        {image
          ? image.map((url, index) => (
              <img key={index} src={url} height={height + "px"} />
            ))
          : ""}
        <input {...rest} type={type} name={name} multiple />
      </div>
    </div>
  );
};

export default UploadImage;
