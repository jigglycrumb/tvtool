export const Footer = () => {
  var year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="content has-text-centered has-text-grey">
        This product uses the{" "}
        <a href="http://www.themoviedb.org/" target="_blank" rel="noopener">
          TMDb
        </a>{" "}
        API but is not endorsed or certified by{" "}
        <a href="http://www.themoviedb.org/" target="_blank" rel="noopener">
          TMDb
        </a>
        .
        <br />
        &copy; <a href="https://github.com/jigglycrumb">jigglycrumb</a> 2014-
        {year}
      </div>
    </footer>
  );
};
