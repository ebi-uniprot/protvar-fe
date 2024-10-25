import React from "react";
import "./PAEImg.css"

interface PAEImgProps {
  imageSrc: string;
}

export const PAEImg: React.FC<PAEImgProps> = ({
                                         imageSrc,
                                       }) => {
  return (
    <div className="image-container">
      <img src={imageSrc} alt="PAE"/>
      <div className="y-axis-label">
        <span>Aligned residue</span>
      </div>
      <div className="x-axis-label">Scored residue</div>
    </div>
  );
};