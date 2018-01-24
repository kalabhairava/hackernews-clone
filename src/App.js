import React, { Component } from "react";
import Loader from "react-loader-spinner";
import "./App.css";

// Hackernews API endpoint
const URL = "https://hn.algolia.com/api/v1/search?query=";

// --------------------------------------------------------------
// Stateful Components
// --------------------------------------------------------------
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: undefined,
      filterTerm: undefined,
      loading: true,
      noResults: false,
      hasError: false
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchTermChange = this.onSearchTermChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onFilterTermChange = this.onFilterTermChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  render() {
    const {
      result,
      searchTerm,
      filterTerm,
      loading,
      noResults,
      hasError
    } = this.state;

    return (
      <div>
        <SearchHeader
          title="Hacker News"
          onSearchSubmit={this.onSearchSubmit}
          searchTerm={searchTerm}
          onSearchTermChange={this.onSearchTermChange}
        />

        {!hasError &&
          !noResults && (
            <Filter
              filterTerm={filterTerm}
              onFilterTermChange={this.onFilterTermChange}
            />
          )}

        <Posts
          list={result ? result.hits : []}
          filterTerm={filterTerm}
          onDismiss={this.onDismiss}
          loading={loading}
          noResults={noResults}
          hasError={hasError}
        />
      </div>
    );
  }

  componentDidMount() {
    this.fetchSearchTopStories(this.state.searchTerm);
  }

  // --------------------------------------------------------------
  // Class Methods
  // --------------------------------------------------------------
  onDismiss(id, event) {
    const updatedList = this.state.result.hits.filter(
      item => item.objectID !== id
    );

    this.setState({
      result: { ...this.state.result, ...{ hits: updatedList } }
    });
  }

  onSearchSubmit(event) {
    this.setState({ loading: true, filterTerm: "" });
    this.fetchSearchTopStories(this.state.searchTerm);
    event.preventDefault();
    return false;
  }

  onSearchTermChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onFilterTermChange(event) {
    this.setState({ filterTerm: event.target.value });
  }

  setSearchTopStories(result) {
    this.setState({
      result,
      loading: false,
      noResults: !result.hits.length,
      hasError: false
    });
  }

  fetchSearchTopStories(searchTerm = " ") {
    fetch(`${URL}${searchTerm}`)
      .then(response => response.json())
      .then(result => {
        console.log("fetch successful, about to render data to the screen");
        this.setSearchTopStories(result);
      })
      .catch(e => {
        console.log(`Error fetching data from ${URL}${searchTerm} =>`, e);
        this.setState({ loading: false, hasError: true });
      });
  }
}

// --------------------------------------------------------------
// Functional Stateless Components
// --------------------------------------------------------------

// --------------------------------------------------------------------------------------------
// Search Header Component:
//    takes search keywords from user, calls HN Search API, and updates the view
// --------------------------------------------------------------------------------------------
function SearchHeader(props) {
  const { title, onSearchSubmit, searchTerm, onSearchTermChange } = props;

  return (
    <div className="header">
      <span className="page-title"> {title} </span>
      <form onSubmit={onSearchSubmit}>
        <input
          name="search"
          type="text"
          value={searchTerm}
          onChange={onSearchTermChange}
          placeholder="Search"
        />
      </form>
    </div>
  );
}

// --------------------------------------------------------------------------------------------
// Filter Component:
//    filters the results using the filter key entered by the user
// --------------------------------------------------------------------------------------------
function Filter(props) {
  const { filterTerm, onFilterTermChange } = props;

  return (
    <div className="filter-box">
      <input
        name="filter"
        type="text"
        value={filterTerm}
        onChange={onFilterTermChange}
        placeholder="Filter Results"
      />
    </div>
  );
}

// --------------------------------------------------------------------------------------------
// Posts Component:
//    renders a list of `Post` components (if exists) or an appropriate error screen
// --------------------------------------------------------------------------------------------
function Posts(props) {
  const { list, filterTerm, onDismiss, loading, noResults, hasError } = props;

  if (loading) {
    return (
      <div className="loader">
        <Loader type="Rings" color="#d3d3d3" height={500} width={500} />
      </div>
    );
  }

  if (hasError) {
    return (
      <ErrorMessage>
        Something went wrong :( Failed to fetch data from Hackernews API. Please
        check your internet connection.
      </ErrorMessage>
    );
  }

  if (noResults) {
    return (
      <ErrorMessage>
        No results found. Please try again with different keywords.
      </ErrorMessage>
    );
  }

  return (
    <div className="table">
      {list.filter(filterSearchResults(filterTerm)).map(item => {
        return (
          <div key={item.objectID} className="table-row">
            <Post item={item} onDismiss={onDismiss} />
          </div>
        );
      })}
    </div>
  );
}

// --------------------------------------------------------------------------------------------
// Post Component:
//    renders a Hacker News post
// --------------------------------------------------------------------------------------------
function Post(props) {
  const { item, onDismiss } = props;

  return (
    <div>
      <div>
        <a title={`Visit ${item.url}`} href={item.url}>
          {item.title}
        </a>
        <span className="dismiss-btn">
          <Button
            onClick={() => onDismiss(item.objectID)}
            classList="dismiss-btn button-inline"
          >
            X
          </Button>
        </span>
      </div>
      <div>
        <span>
          <a
            title={`See ${item.author} profile on HN`}
            href={`https://news.ycombinator.com/user?id=${item.author}`}
            className="sub-link"
          >
            {item.author}
          </a>
        </span>|
        <span>
          <a
            title="See original post on HN"
            href={`https://news.ycombinator.com/item?id=${item.objectID}`}
            className="sub-link"
          >
            {item.num_comments} comments
          </a>
        </span>|
        <span>
          <a
            title="See original post on HN"
            href={`https://news.ycombinator.com/item?id=${item.objectID}`}
            className="sub-link"
          >
            {item.points} points
          </a>
        </span>
        <span>
          <a
            title="Visit the original site"
            href={item.url}
            className="sub-link original-link"
          >
            | ({item.url})
          </a>
        </span>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------------------------
// Button Component:
//    A generic button
// --------------------------------------------------------------------------------------------
function Button(props) {
  const { children, onClick, style, classList } = props;
  return (
    <button onClick={onClick} type="button" style={style} className={classList}>
      {children}
    </button>
  );
}

// --------------------------------------------------------------------------------------------
// Error Component:
//    Generic error component
// --------------------------------------------------------------------------------------------
function ErrorMessage(props) {
  const { children } = props;

  return <div className="error">{children}</div>;
}

// --------------------------------------------------------------
// Private Functions
// --------------------------------------------------------------
function filterSearchResults(filterTerm) {
  if (filterTerm) {
    return item =>
      item.title && item.title.toLowerCase().includes(filterTerm.toLowerCase());
  } else {
    return item => !!item.title;
  }
}

export default App;
