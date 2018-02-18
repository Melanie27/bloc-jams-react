import React, { Component } from 'react';
import albumData from './../data/albums'
import PlayerBar from './PlayerBar';


class Album extends Component {
    
    constructor(props) {
        super(props);
        const album = albumData.find( album => {
            return album.slug === this.props.match.params.slug
          });
      
          this.state = {
            album: album,
            currentSong: album.songs[0],
            currentTime: 0,
            duration: album.songs[0].duration,
            isPlaying: false
          };

          this.audioElement = document.createElement('audio');
          this.audioElement.src = album.songs[0].audioSrc;
    
    }

    play() {
        this.audioElement.play();
        this.setState({isPlaying:true});
    }

    pause() {
        this.audioElement.pause();
        this.setState({ isPlaying: false });
      }

    componentDidMount() {
        this.eventListeners = {
            timeupdate: e => {
              this.setState({ currentTime: this.audioElement.currentTime });
            },
            durationchange: e => {
              this.setState({ duration: this.audioElement.duration });
            }
          };
          this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
          this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    }

    componentWillUnmount() {
        this.audioElement.src = null;
        this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
        this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
      }
      
    setSong(song) {
        this.audioElement.src = song.audioSrc;
        this.setState({ currentSong: song });
      }
      
    handleSongClick(song) {
        const isSameSong = this.state.currentSong === song;
        if (this.state.isPlaying && isSameSong) {
            this.pause(); //if user clicks on the currently playing song, assume they intend to pause it
          } else {
            if (!isSameSong) { this.setSong(song); } //switches to a different song if it's clicked on    
            this.play();
          }
      }

    handlePrevClick() {
        const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
        const newIndex = Math.max(0, currentIndex - 1);
        const newSong = this.state.album.songs[newIndex];
        this.setSong(newSong);
        this.play(newSong);
    }

    handleNextClick(i) {
        const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
        if ( currentIndex < this.state.album.songs.length-1) {
            const newIndex = (currentIndex + 1);
            const newSong = this.state.album.songs[newIndex];
            this.setSong(newSong);
            this.play(newSong);
        } else {
            const finalSong = this.state.album.songs[currentIndex];
            this.setSong(finalSong);
            this.play(finalSong);
        } 
    }

    handleTimeChange(e) {
        const newTime = this.audioElement.duration * e.target.value;
        this.audioElement.currentTime = newTime;
        this.setState({ currentTime: newTime });
      }
    
     
    render() {
      return (
        <section className="album">
            {this.props.match.params.slug} 
           
            <section id="album-info">
                <img id="album-cover-art" src={this.state.album.albumCover} alt="album cover"/>
                <div className="album-details">
                    <h1 id="album-title">{this.state.album.title}</h1>
                    <h2 className="artist">{this.state.album.artist}</h2>
                    <div id="release-info">{this.state.album.releaseInfo}</div>
                </div>
            </section>
           

            <table id="song-list">
                <colgroup>
                    <col id="song-number-column" />
                    <col id="song-title-column" />
                    <col id="song-duration-column" />
                </colgroup>  
                <tbody>
                    {this.state.album.songs.map( (songs, index) =>
                            <tr className="song" key={index} onClick={() => this.handleSongClick(songs)} >
                                <td className="song-actions">
                                    <button>
                                        <span className="song-number">{index+1}</span>
                                        <span className="ion-play"></span>
                                        <span className="ion-pause"></span>
                                    </button>
                                </td>
                                <td >{songs.title}</td>
                                <td >{songs.duration}</td>
                            </tr>
                        )}
                </tbody>
            </table>
            <PlayerBar
           isPlaying={this.state.isPlaying}
           currentSong={this.state.currentSong}
           handleSongClick={() => this.handleSongClick(this.state.currentSong)}
           currentTime={this.audioElement.currentTime}
           duration={this.audioElement.duration}
           handlePrevClick={() => this.handlePrevClick()}
           handleNextClick={() => this.handleNextClick()}
           handleTimeChange={(e) => this.handleTimeChange(e)}
         />
        </section>
      );
    }
  }

export default Album;