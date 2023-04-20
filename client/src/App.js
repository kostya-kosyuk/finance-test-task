import React from 'react'
import { Provider } from 'react-redux';

import { store } from './store';

import Data from './components/Data';

const App = () => {
  return (
    <Provider store={store}>
      <Data />
    </Provider>
  );
};

export default App;
