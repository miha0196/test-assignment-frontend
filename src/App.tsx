import React, { useState, useCallback, useEffect } from 'react';

import { ImageList } from './components/ImageList';
import { Searching } from './components/Searching';

import { ImageCard } from './types';

const App: React.FC = () => {
  const [imageCards, setImageCards] = useState<ImageCard[]>([]);
  const [displayedImages, setDisplayedImages] = useState<ImageCard[]>([]);
  const [isGrouped, setIsGrouped] = useState(false);
  const [tag, setTag] = useState('');

  const setIsGroupHandler = useCallback(() => {
    setIsGrouped((prev) => !prev);
  }, []);

  const setImageCardsHandler = useCallback((ImageCard: ImageCard) => {
    setImageCards((prev) => [ImageCard, ...prev]);
  }, []);

  const clearImageCardsHandler = useCallback(() => {
    setImageCards(() => []);
  }, []);

  const getTagHandler = useCallback((tag: string) => {
    setTag(() => tag);
  }, []);

  useEffect(() => {
    if (!isGrouped) {
      setDisplayedImages(imageCards);
      return;
    }

    const imageGroups: ImageCard[] = [];
    const images = imageCards.flat();
    const imageTags = new Set();

    images.forEach((image) => imageTags.add(image.tag));

    for (let tag of Array.from(imageTags.values())) {
      imageGroups.push(images.filter((image) => image.tag === tag));
    }

    setDisplayedImages(() => imageGroups);
  }, [imageCards, isGrouped]);

  return (
    <div className="container">
      <Searching
        onSetImageCards={setImageCardsHandler}
        onClearImageCards={clearImageCardsHandler}
        tag={tag}
        onSetIsGroup={setIsGroupHandler}
        isGrouped={isGrouped}
      />
      <ImageList displayedImages={displayedImages} onGetTag={getTagHandler} isGrouped={isGrouped} />
    </div>
  );
};

export default App;
