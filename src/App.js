import React, { Component } from "react";
import "./App.css";

// Mock data
const list = [
  {
    by: "kalabhairava",
    descendants: 171,
    id: 9833,
    kids: [],
    score: 1000,
    time: 1175714200,
    title: "My Hacker News Clone build using plain React",
    type: "story",
    url: "http://www.getdropbox.com/u/2/screencast.html"
  },

  {
    by: "dhouston",
    descendants: 71,
    id: 8863,
    kids: [],
    score: 109,
    time: 1175714200,
    title: "Long live React",
    type: "story",
    url: "http://www.getdropbox.com/u/2/screencast.html"
  }
];

// --------------------------------------------------------------
// Stateful Components
// --------------------------------------------------------------
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list,
      searchTerm: ""
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchTerm = this.onSearchTerm.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  render() {
    return (
      <div className="App">
        <h1> Hacker News </h1>
        <Search onSearchTerm={this.onSearchTerm}>Search</Search>
        <Posts
          list={this.state.list}
          searchTerm={this.state.searchTerm}
          onDismiss={this.onDismiss}
        />
        <Button onClick={this.onReset}>Reset</Button>
      </div>
    );
  }

  onDismiss(id, event) {
    console.log("ID", id, event);
    const updatedList = this.state.list.filter(item => item.id !== id);
    this.setState({ list: updatedList });
  }

  onReset() {
    this.setState({ list });
  }

  onSearchTerm(event) {
    this.setState({ searchTerm: event.target.value });
  }
}

// --------------------------------------------------------------
// Functional Stateless Components
// --------------------------------------------------------------
function Search(props) {
  const { children, onSearchTerm } = props;
  return (
    <form>
      <label for="search">{children}</label>
      <input name="search" type="text" onChange={onSearchTerm} />
    </form>
  );
}

function Posts(props) {
  const { list, searchTerm, onDismiss } = props;

  return (
    <div>
      {list.filter(filterSearchResults(searchTerm)).map(item => {
        return (
          <div key={item.id}>
            <p>{item.title}</p>
            <Button onClick={() => onDismiss(item.id)}>Dismiss</Button>
          </div>
        );
      })}
    </div>
  );
}

function Button(props) {
  const { children, onClick } = props;
  return (
    <button onClick={onClick} type="button">
      {children}
    </button>
  );
}

// private functions

function filterSearchResults(searchTerm) {
  return item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
}
export default App;
