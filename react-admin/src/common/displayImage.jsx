import React from "react";
// name = images
//images =
const DisplayImage = ({ name, label, images, height = 200, ...rest }) => {
  return (
    <div>
      <h2>{name}</h2>
      {images.length > 1 ? (
        images.map((img, index) => {
          return (
            <img
              // {...rest}
              key={name + index}
              src={`http://localhost:3900/${img}`}
              height={height + "px"}
            />
          );
        })
      ) : (
        <img
          src={`http://localhost:3900/${images}`}
          alt={label}
          height={height + "px"}
        />
      )}
    </div>
  );
};

export default DisplayImage;
