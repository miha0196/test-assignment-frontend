import React from 'react';

import './styles.less';

import { Image, ImageCard } from '../../types';

type ImageListProps = {
  displayedImages: ImageCard[];
  onGetTag: (tag: string) => void;
  isGrouped: boolean;
};

export const ImageList: React.FC<ImageListProps> = ({ displayedImages, onGetTag, isGrouped }) => (
  <>
    {isGrouped &&
      displayedImages.map((imageGroup: ImageCard) => (
        <div
          className="image-list row mb-3 p-3 border"
          key={imageGroup.reduce((acc, cur) => acc + cur.id, '')}
        >
          <div>{imageGroup[0].tag}</div>
          {imageGroup.map(({ imageUrl, id, tag }: Image) => (
            <div className="col-4 mt-1" key={id}>
              <div className="image-list__item card shadow-sm p-2">
                <img src={imageUrl} alt={tag} onClick={() => onGetTag(tag)} />
              </div>
            </div>
          ))}
        </div>
      ))}

    {!isGrouped && (
      <div className="image-list row">
        {displayedImages.map((imageCard: ImageCard) => (
          <div className="col-4 mb-3" key={imageCard.reduce((acc, cur) => acc + cur.id, '')}>
            <div className="image-list__item card shadow-sm p-2">
              {imageCard.map(({ imageUrl, id, tag }: Image) => (
                <img src={imageUrl} key={id} alt={tag} onClick={() => onGetTag(tag)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </>
);
