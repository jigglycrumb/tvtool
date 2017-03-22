import React from 'react';
import Header from './Header';
import Search from './Search';
import Footer from './Footer';

export default class App extends React.Component {
  render() {
    return (
      <div className="app container">
        <Header />
        <Search app={this.props.app} />
        <Footer />
      </div>
    );
  }

  componentDidMount() {
    // update.add(this.updateProps);
  }

  updateProps() {
    // this.setProps({app: AppState.app});
  }
}
