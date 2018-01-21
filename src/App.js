import React, { Component } from "react";
import "./App.css";

// URL config
const URL = "https:/hn.algolia.com/api/v1/search?query=";
const DEFAULT_QUERY = "redux";

// --------------------------------------------------------------
// Stateful Components
// --------------------------------------------------------------
class App extends Component {
  // lifecycle hooks
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchTerm = this.onSearchTerm.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  render() {
    const { result, searchTerm } = this.state;

    return (
      <div>
        <div className="header">
          <span className="page-title"> Hacker News </span>
          <input
            name="search"
            type="text"
            value={searchTerm}
            onChange={this.onSearchTerm}
          />
        </div>
        {result && (
          <Posts
            list={result.hits}
            searchTerm={searchTerm}
            onDismiss={this.onDismiss}
          />
        )}
      </div>
    );
  }

  componentDidMount() {
    this.fetchSearchTopStories(this.state.searchTerm);
  }

  // class methods
  onDismiss(id, event) {
    console.log("ID", id, event);
    const updatedList = this.state.result.hits.filter(
      item => item.objectID !== id
    );

    this.setState({
      result: { ...this.state.result, ...{ hits: updatedList } }
    });
    console.log("Test", { ...this.state.result, ...{ hits: updatedList } });
  }

  onSearchTerm(event) {
    this.setState({ searchTerm: event.target.value });
  }

  setSearchTopStories(result) {
    this.setState({ result });
  }

  fetchSearchTopStories(searchTerm) {
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

// --------------------------------------------------------------
// Functional Stateless Components
// --------------------------------------------------------------
function Search(props) {
  const { children, value, onSearchTerm } = props;
  return (
    <form>
      <label htmlFor="search">{children}</label>
      <input name="search" type="text" value={value} onChange={onSearchTerm} />
    </form>
  );
}

function Posts(props) {
  const { list, searchTerm, onDismiss } = props;

  return (
    <div className="table">
      {list.filter(filterSearchResults(searchTerm)).map(item => {
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
function filterSearchResults(searchTerm) {
  return item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
}

export default App;

// <a bo-href="&quot;https://news.ycombinator.com/item?id=&quot; + hit.objectID" title="See original post on HN" href="https://news.ycombinator.com/item?id=11505484">
// <span class="date ng-binding">125 points</span>
// </a>

// <a bo-href="&quot;https://news.ycombinator.com/user?id=&quot; + hit.author" title="See acemarke&nbsp;profile" href="https://news.ycombinator.com/user?id=acemarke">
// <span bo-html="hit._highlightResult.author.value" class="author">acemarke</span>
// </a>
