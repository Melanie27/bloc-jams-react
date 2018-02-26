import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing';
import Library from './components/Library';
import Album from './components/Album';


class App extends Component {
  render() {
    return (
      <div className="App">
       <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">Bloc Jams</span>
        <div class="mdl-layout-spacer"></div>
          <nav class="mdl-navigation">
          <a class="mdl-navigation__link"><Link to='/'>Landing</Link></a>
          <a class="mdl-navigation__link"> <Link to='/library'>Library</Link></a>
          </nav>
         </div> 
        
        </header>
       <main class="mdl-layout__content">
       <Route exact path="/" component={Landing} />
        <Route path="/library" component={Library} />
        
        <Route path="/album/:slug" component={Album} />
       </main>  
      </div>
    );
  }
}

export default App;
