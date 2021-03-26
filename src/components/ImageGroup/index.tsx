import React from 'react';

type Image = {
  id: string,
  imageUrl: string,
  tag: string,
}

type ImageCard = Image[];

type ImageGroupProps = { imageCard: ImageCard, onGetTag: (tag: string) => void };

export const ImageGroup: React.FC<ImageGroupProps> = ({ imageCard, onGetTag }) => (
  <>
    {
      imageCard.map(({ imageUrl, id, tag }: Image) => <img src={imageUrl} key={id} alt={tag} onClick={() => onGetTag(tag)} />)
    }
  </>
)