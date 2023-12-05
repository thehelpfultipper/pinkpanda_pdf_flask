import { useState, Fragment } from 'react';

import Header from './Components/Layout/Header';
import Main from './Components/Layout/Main';
import Footer from './Components/Layout/Footer';

import s from './App.module.scss';

function App() {
  let [start, setStart] = useState(false);

  const startBtnHandler = () => setStart(!start);

  return (
    <Fragment>
      <Header start={start} />
      <Main start={start} onStart={startBtnHandler} />
      <Footer />
    </Fragment>
  );
}

export default App;
