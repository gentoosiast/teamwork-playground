import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, ISetting} from "../dto";

class Sound {
    private soundAudio: HTMLAudioElement;
    private musicAudio: HTMLAudioElement;
    private sound:ISetting = {
      volume: 0.5,
      isSound: true
    }
    private music:ISetting = {
      volume: 0.5,
      isSound: false
    }
    // private isSound: boolean = true;
    // private volumeValue: number = 0.5
    // private isMusic: boolean = false;
    // private musicValue: number = 0.5;
    constructor() {
      this.soundAudio = new Audio();
      this.musicAudio = new Audio();
      this.musicAudio.currentTime = 0;
      this.musicAudio.src = './assets/mp3/music.mp3';
      //this._playMusic()
    }

    getSetting(type:'music'|'sound') {
      if(type==='music'){
        return this.music;
      }
      return this.sound;
    }
  
    updateSetting(type:string, setting:ISetting) {
      if(type==='music'){
        this.music = Object.assign(setting);
        
      }else{
        this.sound = Object.assign(setting);
      }
      if (this.music.isSound) {
        this._playMusic();
      } else {
        this.musicAudio.pause();
      }
    }
  
    killShip() {
      if (this.sound.isSound) {
        this.soundAudio.src = './assets/mp3/kill.mp3';
        this.soundAudio.volume = this.sound.volume;
        this.soundAudio.play();
      }
    }
  
    shotShip() {
      if (this.sound.isSound) {
        this.soundAudio.src = './assets/mp3/shot.mp3';
        this.soundAudio.volume = this.sound.volume;
        this.soundAudio.play();
      }
    }
  
    missShip() {
      if (this.sound.isSound) {
        this.soundAudio.src = './assets/mp3/miss.mp3';
        this.soundAudio.volume = this.sound.volume;
        this.soundAudio.play();
      }
    }
  
    private _playMusic() {
      this.musicAudio.volume = this.music.volume;
      this.musicAudio.play();
      this.musicAudio.onended = () => {
        this.musicAudio.currentTime = 0;
        this.musicAudio.play();
      };
    }
  }
  
  export default new Sound();