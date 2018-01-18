import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    // To use vars inside JSX, wrap them in {}
    const welcomeMessage = "Welcome to the Road to Learn React";

    // Objects cannot be child elements in JSX
    const user = {
      name: 'Batman',
      vehicle: 'Batcar'
    };

    // Arrays can be rendered using JSX
    const superheros = ['Batman', 'Superman', 'Arrow'];

    // render must return something. If you want to render empty element, use `return null`
    return (
      // No JS style comments inside JSX
      // To use comments inside JSX => http://wesbos.com/react-jsx-comments/
      <div className="App">
        <h2> {welcomeMessage} </h2>
        <h3> I am {user.name}, and I drive {user.vehicle}</h3>
        <p> Who is your hero?! {superheros} </p>
      </div>
    );
  }
}
export default App;
