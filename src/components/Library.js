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
            <section className='library'>
                
                {
                    this.state.albums.map( (album, index) =>
                        <Link to={`/album/${album.slug}`} key={index} >   
                            <img src={album.albumCover} alt={album.title} />
                            <div>{album.title}</div>
                            <div>{album.artist}</div>
                             <div>{album.songs.length} songs</div>
                        </Link>
                    ) 
                }
            </section>

        );
    }
}

export default Library;