import React from "react";

const DisplayImage = ({ name, label, images, height = 200, ...rest }) => {
  return (
    <div className="col-md-10">
      {images.length > 1 ? (
        images.map((img, index) => {
          return (
            <img
              // {...rest}
              key={name + index}
              src={`${process.env.REACT_APP_API_IMAGE_URL}/${img}`}
              height={height + "px"}
            />
          );
        })
      ) : (
        <img
          src={`${process.env.REACT_APP_API_IMAGE_URL}/${images}`}
          alt={label}
          height={height + "px"}
        />
      )}
    </div>
  );
};

export default DisplayImage;
