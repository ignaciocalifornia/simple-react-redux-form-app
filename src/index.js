import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import App from './App';
import './index.css';

const reducer = combineReducers({
  form: formReducer
});
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
