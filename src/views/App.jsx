import React from "react";
import { Header } from "./Header";
import Search from "./Search";
import { Footer } from "./Footer";

class App extends React.Component {
  render() {
    return (
      <div className="app container">
        <Header />
        <Search />
        <Footer />
      </div>
    );
  }
}

export default App;
