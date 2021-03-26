import React, { ChangeEvent, FormEvent, useState } from 'react';

import { Modal } from '../Modal';

import './styles.less';

type ImageCard = {
  id: string,
  imageUrl: string,
  tag: string,
}

type SearchingProps = {
  onSetImageCards: (tags: ImageCard[]) => void,
  onClearImageCards: () => void;
}

type CloseHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void

export const Searching: React.FC<SearchingProps> = ({ onSetImageCards, onClearImageCards }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value.replace(/[^a-zA-Z,]+/, ''));
  }

  const fetchImageHandler = async (APIKey: string, tags: string[]) => {
    let imageDataArr = await Promise.all(tags.map(tag => fetch(`https://api.giphy.com/v1/gifs/random?api_key=${APIKey}&tag=${tag}`)))
      .then(responses => Promise.all(responses.map(r => r.json())))
      .catch(errors => setModalMessage(errors))
      .finally(() => {
        setIsLoading(false)
      }) || [];

    if (imageDataArr[0].message) {
      setModalMessage(imageDataArr[0].message);
      return
    }

    if (imageDataArr.filter(item => item.data.length === 0).length) {
      setModalMessage("По тегу ничего не найдено")
    }

    imageDataArr = imageDataArr.filter(item => item.data.length !== 0)

    if (imageDataArr.length === 0) {
      return
    }

    // Неверное присвоение tag: tags[idx]
    const imageCards = imageDataArr.map((imageData, idx) => ({ id: imageData.data.id, imageUrl: imageData.data.image_url, tag: tags[idx] }))

    onSetImageCards(imageCards)
  }

  const submitSearchHandler = (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!inputValue) {
      setModalMessage("Заполните поле 'тег'")
      return
    } 

    setIsLoading(true);
    fetchImageHandler('uqBOOTxG04QDOhkJ7zA7vePHJMjk7dP7', inputValue.split(/[^a-zA-Z]+/));
    setInputValue('');
  }

  const closeHandler: CloseHandler = (event) => {
    const target = (event.target as HTMLDivElement);
    
    if (target.classList.contains('modal')) {
      target.classList.toggle('d-none')
    }

    if (target.classList.contains('close')) {
      target.closest('.modal')!.classList.toggle('d-none')
    }

    target.closest('.modal')!.nextElementSibling!.classList.toggle('d-none')
  }

  const clearHandler = () => {
    onClearImageCards();
    setInputValue('');
  }

  return (
    <>
    <div className="searching" onSubmit={event => submitSearchHandler(event)}>
      <form className="searching__form pt-3 d-flex justify-content-around">
        <input type="text" className="form-control form-control-md" placeholder="Введите тэг" value={inputValue} onChange={event => inputChangeHandler(event)} />
        {
          isLoading 
            ? <button type="submit" className="btn btn-success" disabled>Загрузка...</button>
            : <button type="submit" className="btn btn-success">Загрузить</button>
        }
          <button type="button" className="btn btn-primary" onClick={clearHandler}>Очистить</button>
        <button type="button" className="btn btn-danger">Группировать</button>
      </form>
    </div>

    {/*  */}
    {
        modalMessage && <Modal message={modalMessage} onClose={closeHandler} />
    }
    </>
  )
}