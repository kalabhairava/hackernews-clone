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
      list
    };

    this.onDismiss = this.onDismiss.bind(this);
  }

  render() {
    return (
      <div className="App">
        <h1> Hacker News </h1>
        {this.state.list.map(item => (
          <div key={item.id}>
            <p>{item.title}</p>
            <button onClick={() => this.onDismiss(item.id)} type="button">
              Dismiss
            </button>
          </div>
        ))}
      </div>
    );
  }

  onDismiss(id) {
    console.log("ID", id);
    const updatedList = this.state.list.filter(item => item.id !== id);
    this.setState({ list: updatedList });
  }
}

export default App;
