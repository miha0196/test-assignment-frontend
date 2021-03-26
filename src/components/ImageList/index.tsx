import React from 'react';

import { ImageGroup } from '../ImageGroup';

import './styles.less';

type Image = {
  id: string,
  imageUrl: string,
  tag: string,
}

type ImageCard = Image[]

type imageCards = ImageCard[]

type ImageListProps = {
  imageCards: imageCards
}

export const ImageList: React.FC<ImageListProps> = ({ imageCards }) => {
  const getTagHandler = (tag: string) => {
    console.log(tag)
  }

  return (
    <div className="image-list row mt-3">
      {
        imageCards.map((imageCard: ImageCard) => (
          <div className="col-4" key={imageCard.reduce((acc, cur) => acc + cur.id, '')}>
            <div className="image-list__item card shadow-sm p-2">
              <ImageGroup imageCard={imageCard} onGetTag={getTagHandler} />
            </div>
          </div>
        ))
      }
    </div>
  )
}