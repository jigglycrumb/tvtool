import { Footer } from "./Footer";
import { Header } from "./Header";
import Search from "./Search";

const App = () => (
  <div className="app">
    <div className="container">
      <Header />
      <Search />
    </div>
    <Footer />
  </div>
);

export default App;
