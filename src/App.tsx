import React, { useState } from 'react';

import { ImageList } from './components/ImageList';
import { Searching } from './components/Searching';

type Image = {
  id: string,
  imageUrl: string,
  tag: string,
}

type ImageCard = Image[]

const App: React.FC = () => {
  const [imageCards, setImageCards] = useState<ImageCard[]>([]);

  const setImageCardsHandler = (ImageCard: ImageCard) => {
    setImageCards((prev) => [ImageCard, ...prev]);
  }

  const clearImageCardsHandler = () => {
    setImageCards([]);
  }

  return (
    <div className="container">
      <Searching onSetImageCards={setImageCardsHandler} onClearImageCards={clearImageCardsHandler} />
      <ImageList imageCards={imageCards} />
    </div>
  );
}

export default App;
