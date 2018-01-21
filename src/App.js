import React, { Component } from "react";
import Loader from "react-loader-spinner";
import "./App.css";

// Hackernews API endpoint
const URL = "https:/hn.algolia.com/api/v1/search?query=";

// --------------------------------------------------------------
// Stateful Components
// --------------------------------------------------------------
class App extends Component {
  // lifecycle hooks
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: " ",
      filter: "",
      loading: true
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchTerm = this.onSearchTerm.bind(this);
    this.onFilterTerm = this.onFilterTerm.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  render() {
    const { result, searchTerm, onSearchSubmit, filter, loading } = this.state;

    return (
      <div>
        <div className="header">
          <span className="page-title"> Hacker News </span>
          <form onSubmit={event => this.onSearchSubmit(event)}>
            <input
              name="search"
              type="text"
              value={searchTerm}
              onChange={this.onSearchTerm}
              placeholder="Search"
            />
          </form>
        </div>
        <div className="filter-box">
          <input
            name="search"
            type="text"
            value={filter}
            onChange={this.onFilterTerm}
            placeholder="Filter Results"
          />
        </div>
        <Posts
          list={result ? result.hits : []}
          filter={filter}
          onDismiss={this.onDismiss}
          loading={loading}
        />
      </div>
    );
  }

  componentDidMount() {
    this.fetchSearchTopStories(this.state.searchTerm);
    // searchTerm is set to space (" ") to make the initial call to HN API work.
    // set it to null after first render() so that placeholder is visible
    this.setState({ searchTerm: "" });
  }

  // class methods
  onDismiss(id, event) {
    const updatedList = this.state.result.hits.filter(
      item => item.objectID !== id
    );

    this.setState({
      result: { ...this.state.result, ...{ hits: updatedList } }
    });
  }

  onSearchSubmit(event) {
    this.setState({ loading: true });
    this.fetchSearchTopStories(this.state.searchTerm);
    event.preventDefault();
    return false;
  }

  onSearchTerm(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onFilterTerm(event) {
    this.setState({ filter: event.target.value });
  }

  setSearchTopStories(result) {
    this.setState({ result, loading: false });
  }

  fetchSearchTopStories(searchTerm) {
    if (searchTerm) {
      fetch(`${URL}${searchTerm}`)
        .then(response => response.json())
        .then(result => {
          console.log("fetch successful, about to render data to the screen");
          this.setSearchTopStories(result);
        })
        .catch(e => {
          console.log(`Error fetching data from ${URL}${searchTerm} =>`, e);
        });
    }
  }
}

// --------------------------------------------------------------
// Functional Stateless Components
// --------------------------------------------------------------
function Posts(props) {
  const { list, filter, onDismiss, loading } = props;

  if (loading)
    return (
      <div className="loader">
        <Loader type="Rings" color="#d3d3d3" height={500} width={500} />
      </div>
    );

  return (
    <div className="table">
      {list.filter(filterSearchResults(filter)).map(item => {
        return (
          <div key={item.objectID} className="table-row">
            <Post item={item} onDismiss={onDismiss} />
          </div>
        );
      })}
    </div>
  );
}

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
        </span>|
        <span>
          <a
            title="Visit the original site"
            href={item.url}
            className="sub-link"
          >
            ({item.url})
          </a>
        </span>
      </div>
    </div>
  );
}

function Button(props) {
  const { children, onClick, style, classList } = props;
  return (
    <button onClick={onClick} type="button" style={style} className={classList}>
      {children}
    </button>
  );
}

// --------------------------------------------------------------
// Private Functions
// --------------------------------------------------------------
function filterSearchResults(filter) {
  if (filter) {
    return item =>
      item.title && item.title.toLowerCase().includes(filter.toLowerCase());
  } else {
    return item => !!item.title;
  }
}

export default App;
