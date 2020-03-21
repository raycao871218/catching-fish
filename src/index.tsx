import Game from './Game';


import * as React from 'react';
import * as ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';

import './index.css';



ReactDOM.render(
  <Game />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
