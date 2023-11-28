import { useState, useEffect } from 'react';
import css from './App.module.css';
import ImageGallery from './ImageGallery/ImageGallery';
import Searchbar from './Searchbar/Searchbar';
import Modal from './Modal/Modal';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import fetchPixabayImages from 'api/fetchImages';

export const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPixabayImages(query, page);

        const { hits, totalHits } = data;
        setPictures(prevState => [...prevState, ...hits]);
        setIsLoading(false);
        setShowModal(false);
        setLoadMore(hits.length > 0);

        const imagesLoaded = page * 12;
        if (imagesLoaded >= totalHits) {
          setLoadMore(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Failed to fetch images:', error);
      }
    };
    fetchImages();
  }, [page, query]);

  const handleSearch = query => {
    setQuery(query);
    setPage(1);
    setPictures([]);
    setLoadMore(true);
  };

  const openModal = imageUrl => {
    setShowModal(true);
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage('');
  };

  const loadMoreImages = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className={css.Application}>
      <Searchbar onSubmit={handleSearch} />
      <ImageGallery pictures={pictures} openModal={openModal} />

      {isLoading && <Loader />}
      {showModal && <Modal imageUrl={selectedImage} closeModal={closeModal} />}
      {pictures.length > 0 && loadMore && <Button onClick={loadMoreImages} />}
    </div>
  );
};
