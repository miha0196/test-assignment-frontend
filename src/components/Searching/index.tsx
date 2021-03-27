import React, { ChangeEvent, FormEvent, useEffect, useState, useCallback } from 'react';

import { Modal } from '../Modal';

import './styles.less';

import { ImageCard } from '../../types';

type SearchingProps = {
  onSetImageCards: (tags: ImageCard) => void;
  onClearImageCards: () => void;
  onSetIsGroup: () => void;
  tag: string;
  isGrouped: boolean;
};

type FetchImageHandler = (APIKey: string, tags: string[]) => void;

type CloseHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;

export const Searching: React.FC<SearchingProps> = ({
  onSetImageCards,
  onClearImageCards,
  onSetIsGroup,
  tag,
  isGrouped,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isDelay, setIsDelay] = useState(false);

  const fetchImageHandler: FetchImageHandler = useCallback(
    async (APIKey, tags) => {
      let imageDataArr =
        (await Promise.all(
          tags.map((tag) =>
            fetch(`https://api.giphy.com/v1/gifs/random?api_key=${APIKey}&tag=${tag}`)
          )
        )
          .then((responces) => Promise.all(responces.map((v) => v.json())))
          .then((result) => result)
          .catch((result) => {
            setModalMessage(`Ошибка запроса: ${result.message}`);
          })
          .finally(() => setIsLoading(false))) || [];

      if (imageDataArr.length === 0) {
        return;
      }

      if (imageDataArr.filter((item) => item.data.length === 0).length) {
        setModalMessage('По тегу ничего не найдено');
      }

      imageDataArr = imageDataArr.map((imageData, idx) => ({
        id: imageData.data.id,
        imageUrl: imageData.data.image_url,
        tag: tags[idx],
      }));

      const imageCards = imageDataArr.filter((item) => item.id);

      if (imageCards.length !== 0) {
        onSetImageCards(imageCards);
      }
    },
    [onSetImageCards]
  );

  const makeTag = useCallback(() => {
    let text = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i <= Math.ceil(10 * Math.random()); i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return [text];
  }, []);

  useEffect(() => {
    if (!isDelay) {
      return;
    }

    const getRandomImage = () => {
      const tag = makeTag();
      fetchImageHandler!('uqBOOTxG04QDOhkJ7zA7vePHJMjk7dP7', tag);
    };

    const id = setInterval(getRandomImage, 5000);
    return () => clearInterval(id);
  }, [makeTag, isDelay, fetchImageHandler]);

  useEffect(() => {
    setInputValue((prev) => (prev ? `${prev},${tag}` : tag));
  }, [tag]);

  const inputChangeHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(() => event.target.value.replace(/[^a-zA-Z,]+/, ''));

    if (event.target.value.replace(/[^a-zA-Z,]+/, '').toLocaleLowerCase() !== 'delay') {
      setIsDelay(false);
    }
  }, []);

  const submitSearchHandler = useCallback(
    (event: FormEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!inputValue) {
        setModalMessage(() => "Заполните поле 'тег'");
        return;
      }

      if (inputValue.toLocaleLowerCase() === 'delay') {
        setModalMessage(() => 'Автозагрузка рандомных тэгов влючена');
        setIsDelay(true);
        return;
      }

      setIsLoading(() => true);
      fetchImageHandler(
        'uqBOOTxG04QDOhkJ7zA7vePHJMjk7dP7',
        inputValue.toLowerCase().split(/[^a-zA-Z]+/)
      );
      setInputValue(() => '');
    },
    [fetchImageHandler, inputValue]
  );

  const closeHandler: CloseHandler = useCallback(() => {
    setModalMessage(() => '');
  }, []);

  const clearHandler = useCallback(() => {
    onClearImageCards();
    setInputValue(() => '');
  }, [onClearImageCards]);

  return (
    <>
      <div className="searching mb-4" onSubmit={(event) => submitSearchHandler(event)}>
        <form className="searching__form pt-3 d-flex justify-content-around">
          <input
            type="text"
            className="form-control form-control-md"
            placeholder="Введите тэг"
            value={inputValue}
            onChange={(event) => inputChangeHandler(event)}
          />
          <button type="submit" className="btn btn-success" disabled={isLoading}>
            {isLoading ? 'Загрузка...' : 'Загрузить'}
          </button>
          <button type="button" className="btn btn-primary" onClick={clearHandler}>
            Очистить
          </button>
          <button type="button" className="btn btn-danger" onClick={onSetIsGroup}>
            {isGrouped ? 'Разгруппировать' : 'Группировать'}
          </button>
        </form>
      </div>

      {modalMessage && (
        <Modal>
          <div className="modal d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <h5>{modalMessage}</h5>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={closeHandler} className="btn btn-primary close">
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop" onClick={closeHandler} style={{ opacity: 0.7 }}></div>
        </Modal>
      )}
    </>
  );
};
