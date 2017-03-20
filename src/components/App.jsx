import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default class App extends React.Component {
  render() {
    return (
      <div className="app container">
        <Header />
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


/*
var App = React.createClass({
  render: function() {
    return (
      <div className="app container">
        <Header />
        <Search app={this.props.app} />
        <Footer />
      </div>
    );
  },
  componentDidMount: function() {
    update.add(this.updateProps);
  },
  updateProps: function() {
    this.setProps({app: AppState.app});
  },
});
*/
