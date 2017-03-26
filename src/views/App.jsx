import React from 'react';
import Header from './Header';
import SearchContainer from '../Containers/SearchContainer';
import Footer from './Footer';

export default class App extends React.Component {
  render() {
    return (
      <div className="app container">
        <Header />
        <SearchContainer />
        <Footer />
      </div>
    );
  }
}
