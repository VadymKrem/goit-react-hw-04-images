import { Component } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ApiService from '../Api';

import Searchbar from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';

import { Container } from './App.styled';

const apiService = new ApiService();

export class App extends Component {
  state = {
    searchQuery: ``,
    galleryItems: [],
    galleryPage: 1,

    isLoading: false,
    isButtonShow: false,
    error: true,
  };

  componentDidUpdate(_, prevState) {
    const prevQuery = prevState.searchQuery;
    const nextQuery = this.state.searchQuery;
    const prevPage = prevState.galleryPage;
    const nextPage = this.state.galleryPage;

    if (prevQuery !== nextQuery || prevPage !== nextPage) {
      this.fetchGalleryItems(nextQuery, nextPage);

    }
  }

  fetchGalleryItems = (nextQuery, nextPage) => {
    this.setState({ loading: true, error: false });

    apiService.query = nextQuery;
    apiService.page = nextPage;

    apiService.fetchPost().then(data => {

      if (!data.totalHits) {
        this.setState({ loading: false, error: true });
        return toast.warn(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      const newData = data.hits.map(
        ({ id, tags, webformatURL, largeImageURL }) => ({
          id,
          tags,
          webformatURL,
          largeImageURL,
        })
      );
console.log(this.state.galleryPage)      
      console.log(data.totalHits)
        this.setState(prevState => ({
          galleryItems: [...prevState.galleryItems, ...newData],
          isButtonShow: this.state.galleryPage < Math.ceil(data.totalHits / 12),
        }));
      if (nextPage === 1) {
        toast.success(`Hooray! We found ${apiService.hits} images.`);
      }
    });
  };

  handleFormSubmit = searchQuery => {
    this.setState({ searchQuery, galleryPage: 1, galleryItems: [], isButtonShow: false });
  };

  onLoadMore = () => {
    this.setState(prevState => ({
      galleryPage: prevState.galleryPage + 1,
    }));
  };

  render() {
    const { galleryItems, isLoading: loading, isButtonShow, error } = this.state;

    return (
      <Container>
        <Searchbar onSubmit={this.handleFormSubmit} />

        {error && <h2>Please, enter search word!</h2>}
        {!error && <ImageGallery galleryItems={galleryItems} />}
        {loading && <Loader />}
        {isButtonShow && <Button onClick={this.onLoadMore} />}

        {/* Add */}
        <ToastContainer autoClose={2000} theme="dark" />
      </Container>
    );
  }
}