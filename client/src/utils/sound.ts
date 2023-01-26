import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, ISetting} from "../dto";

class Sound {
    private audio: HTMLAudioElement;
    private music: HTMLAudioElement;
    private isMusicPlay: boolean = true;
    private isSound: boolean = true;
    private volumeValue: number = 1;
    private isMusic: boolean = false;
    private musicValue: number = 1;
    constructor() {
      this.audio = new Audio();
      this.music = new Audio();
      this.music.src = './assets/mp3/music.mp3';
      this._playMusic()
    }
  
    updateSetting(setting:ISetting) {
      this.isSound = setting.isSound;
      this.volumeValue = setting.volumeSound;
      this.isMusic = setting.isMusic;
      this.musicValue = setting.volumeMusic;
      if (this.isMusic) {
        this._playMusic();
      } else {
        this.music.pause();
        this.isMusicPlay = false;
      }
    }
  
    killShip() {
      if (this.isSound) {
        this.audio.src = './assets/mp3/kill.mp3';
        this.audio.volume = this.volumeValue;
        this.audio.play();
      }
    }
  
    shotShip() {
      if (this.isSound) {
        this.audio.src = './assets/mp3/shot.mp3';
        this.audio.volume = this.volumeValue;
        this.audio.play();
      }
    }
  
    missShip() {
      if (this.isSound) {
        this.audio.src = './assets/mp3/miss.mp3';
        this.audio.volume = this.volumeValue;
        this.audio.play();
      }
    }
  
    _playMusic() {
      if (!this.isMusicPlay) {
        this.music.currentTime = 0;
      }
      this.music.volume = this.musicValue;
      this.music.play();
      this.music.onended = () => {
        this.music.currentTime = 0;
        this.music.play();
      };
    }
  }
  
  export default new Sound();