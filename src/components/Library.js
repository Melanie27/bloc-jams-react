import React, {Component} from 'react' //convert library page into a class-based component
import { Link } from 'react-router-dom'; //library can link to each router
import albumData from './../data/albums'


class Library extends Component {
    constructor(props) {
        super(props);
        this.state = {albums:albumData}; //assign the albumData array to the album property of of the state object- why is data part of state?
    }
    
    render() {
        return (
            <section className='library '>
                
                {
                    this.state.albums.map( (album, index) =>
                        <Link to={`/album/${album.slug}`} key={index} >   
                            <section className ="album mdl-grid">
                            <img className="mdl-cell--8-col album-img" src={album.albumCover} alt={album.title} />
                            <div className="mdl-cell--4-col">
                                <div><h2>{album.title}</h2></div>
                                <div><h3>{album.artist}</h3></div>
                                <div><h4>{album.songs.length} songs</h4></div>
                            </div>
                            </section>
                        </Link>
                    ) 
                }
            </section>

        );
    }
}

export default Library;