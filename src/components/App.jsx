import { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PostsApiService from '../Api';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';

import { Container } from './App.styled';

const postApiService = new PostsApiService();

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryPage, setGalleryPage] = useState(1);
  const [isButtonShow, setIsButtonShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!searchQuery) return;

    const fetchGalleryItems = (query, page) => {
      setIsLoading(true);

      postApiService.query = query;
      postApiService.page = page;

      postApiService
        .fetchPost()
        .then(data => {
          const newData = data.hits.map(
            ({ id, tags, webformatURL, largeImageURL }) => ({
              id,
              tags,
              webformatURL,
              largeImageURL,
            })
          );

          setGalleryItems(prevGalleryItems => [
            ...prevGalleryItems,
            ...newData,
          ]);

          if (!data.totalHits) {
            return toast.warn(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          }

          if (page === 1) {
            toast.success(`Hooray! We found ${data.totalHits} images.`);
          }
          setIsButtonShow(galleryPage < Math.ceil(data.totalHits / 12));
        })
        .catch(error => {
          toast.error(error.message);
          setError(true);
          setGalleryItems([]);
          setGalleryPage(1);
        })
        .finally(() => setIsLoading(false));
    };

    fetchGalleryItems(searchQuery, galleryPage);
  }, [searchQuery, galleryPage]);

  const handleFormSubmit = searchQuery => {
    setGalleryItems([]);
    setGalleryPage(1);
    setError(false);
    setSearchQuery(searchQuery);
  };

  const onLoadMore = () => {
    setGalleryPage(prevGalleryPage => prevGalleryPage + 1);
  };

  return (
    <Container>
      <Searchbar onSubmit={handleFormSubmit} />

      {error && <h2>Please, enter search word!</h2>}
      {!error && <ImageGallery galleryItems={galleryItems} />}
      {isLoading && <Loader />}
      {isButtonShow && <Button onClick={onLoadMore} />}

      {/* Add */}
      <ToastContainer autoClose={2000} theme="dark" />
    </Container>
  );
};
