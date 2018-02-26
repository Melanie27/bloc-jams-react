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
            currentVolume: .3,
            isPlaying: false,
            displayHover:album.songs.map(() => false),
            displaySongNumber: album.songs.map(() => true)
            

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
              this.setState({ currentTime: this.formatTime(this.audioElement.currentTime) });
            },
            durationchange: e => {
              this.setState({ duration: this.audioElement.duration });
            },
          
            volumechange: e => {
                this.setState({ maxVolume: this.audioElement.maxVolume});
              }
          };
          this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
          this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
          this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
    }

    componentWillUnmount() {
        this.audioElement.src = null;
        this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
        this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
        this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
      }

    setSong(song) {
        this.audioElement.src = song.audioSrc;
        this.setState({ currentSong: song });
        let newDisplay = this.state.album.songs.map(() => true);
        newDisplay[this.state.album.songs.indexOf(song)] = false;
        this.setState({displaySongNumber: newDisplay});
      }
      
    handleSongClick(song) {
        const isSameSong = this.state.currentSong === song;
        if (this.state.isPlaying && isSameSong) {
            this.pause(); //if user clicks on the currently playing song, assume they intend to pause it
          } else {
            if (!isSameSong) { this.setSong(song); } //switches to a different song if it's clicked on    
            this.play();
          }
          let newDisplay = this.state.album.songs.map(() => true);
          newDisplay[this.state.album.songs.indexOf(song)] = false;
          this.setState({ displaySongNumber: newDisplay }); 
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
        this.setState({ currentTime: this.formatTime(newTime) });
      }


    handleVolumeChange(e) {
        const newVolume = e.target.value;
        this.audioElement.volume = newVolume;
        this.setState({ currentVolume: newVolume });
        //console.log('new volume ' + newVolume);
    }

    
    formatTime(currentTime) {
       
    var mins = Math.trunc(currentTime / 60);
    var secs = Math.round(currentTime % 60) < 10 ? '0' + Math.round(currentTime % 60) : Math.round(currentTime % 60);
    return isNaN(currentTime) ? "-:--" : mins + ":" + secs;

    }

    buttonClass(index) {
      
       if((this.state.isPlaying) && this.state.currentSong === this.state.album.songs[index]){
        //console.log(index); 
            return "ion-pause";
            return "ion-play " + "song-number-" + index;
       } else if ((!this.state.isPlaying) && this.state.currentSong === this.state.album.songs[index]) {
            return "ion-play " + "song-number-" + index;
        } else {
            return "song-number-" + index;
        }
               
    }

    hoverOn(e, index) {
           
        const newDisplay = this.state.displayHover.map((disp, indexDisp) =>  indexDisp === index ? true : false )
        this.setState({ displayHover : newDisplay });
    }
           
         
    hoverOff() {
      const newDisplay = this.state.displayHover.map(() => false);
       this.setState({ displayHover : newDisplay });
    }
           
           
     
    render() {
       
       

        return (
            
        <section className="album mdl-grid">
           
           
            <section id="album-info" className="mdl-cell--4-col">
                <img id="album-cover-art" src={this.state.album.albumCover} alt="album cover"/>
                
            </section>
           
            <div className="album-details mdl-cell--8-col">
                    <h2 id="album-title">{this.state.album.title}</h2>
                    <h3 className="artist">{this.state.album.artist}</h3>
                    <h4 id="release-info">{this.state.album.releaseInfo}</h4>


             <table id="song-list" class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-cell--12-col">
                <colgroup>
                    <col id="song-number-column" />
                    <col id="song-title-column" />
                    <col id="song-duration-column" />
                </colgroup>  
                <tbody>
                    {this.state.album.songs.map( (song, index) =>
                            <tr className="song" key={index} onMouseEnter={(e) => this.hoverOn(e, index)} onMouseLeave={() => this.hoverOff()} onClick={() => this.handleSongClick(song)} >
                                <td className= "mdl-data-table__cell--non-numeric">
                                    <button className="mdl-button mdl-button--colored ">
                                    <span className={this.buttonClass(index)} style={{display: this.state.displayHover[index] || this.state.displaySongNumber[index] ? "none" : "" }}></span>
                                        <span className="hi" style={{display: this.state.displayHover[index] || !this.state.displaySongNumber[index] ? "none" : "" }}>{index}</span>
                                        <span className="ion-play" style={{display: this.state.displayHover[index] ? "" : "none" }}></span>
                                    </button>
                                </td>
                                <td >{song.title}</td>
                                <td >{this.formatTime(song.duration)}</td>
                            </tr>
                        )}
                </tbody>
            </table>        
            </div>
            <PlayerBar
           isPlaying={this.state.isPlaying}
           currentSong={this.state.currentSong}
           currentTime={this.audioElement.currentTime}
           duration={this.audioElement.duration}
           volume={this.audioElement.volume}
           currentVolume={this.state.currentVolume}
           handleSongClick={() => this.handleSongClick(this.state.currentSong)}
           handlePrevClick={() => this.handlePrevClick()}
           handleNextClick={() => this.handleNextClick()}
           handleTimeChange={(e) => this.handleTimeChange(e)}
           handleVolumeChange={(e) => this.handleVolumeChange(e)}
           formatTime={(time) => this.formatTime(time)}
           
         />
           
            
        </section>
      );
    }
  }

export default Album;