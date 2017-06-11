import React, { Component } from 'react';
import { process } from './lib';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    process()
      .then((data) => {
        console.log('process', data);
      })
      .catch((error) => {
        console.error('process', error);
      });
  }

  render() {
    return (
      <div>
        <h1>App</h1>
      </div>
    );
  }
}
