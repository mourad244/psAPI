import React from "react";
import { imageUrl } from "../config.json";

// name = images
//images =
const DisplayImage = ({ name, label, images, height = 200, ...rest }) => {
  return (
    <div className="col-md-10">
      {images.length > 1 ? (
        images.map((img, index) => {
          return (
            <img
              // {...rest}
              key={name + index}
              src={`${imageUrl}/${img}`}
              height={height + "px"}
            />
          );
        })
      ) : (
        <img src={`${imageUrl}/${images}`} alt={label} height={height + "px"} />
      )}
    </div>
  );
};

export default DisplayImage;
