import React, { Component } from "react";
import "./App.css";

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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list,
      searchTerm: ""
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchTerm = this.onSearchTerm.bind(this);
  }

  render() {
    return (
      <div className="App">
        <h1> Hacker News </h1>
        {this.state.list
          .filter(filterSearchResults(this.state.searchTerm))
          .map(item => {
            const handleDismiss = () => this.onDismiss(item.id);
            return (
              <div key={item.id}>
                <p>{item.title}</p>
                <button onClick={handleDismiss} type="button">
                  Dismiss
                </button>
              </div>
            );
          })}
        <button onClick={() => this.onReset()} type="button">
          Reset
        </button>
        <form>
          <input type="text" onChange={this.onSearchTerm} />
        </form>
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

function filterSearchResults(searchTerm) {
  return item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
}

export default App;
