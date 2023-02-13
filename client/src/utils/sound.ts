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
      this.musicAudio.src = './public/assets/mp3/music.mp3';
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
        this.playMusic();
      } else {
        this.musicAudio.pause();
      }
    }
    
    playAudio(status: string){
      console.log(status)
      switch (status){
        case 'shot':
          this.shotShip();
          break;
        case 'killed':
          this.killShip();
          break;
        case 'miss':
          this.missShip()
          break;
      }

    }
  
    private killShip() {
      if (this.sound.isSound) {
        this.soundAudio.src = './public/assets/mp3/killed.mp3';
        this.soundAudio.volume = this.sound.volume;
        this.soundAudio.play();
      }
    }
  
    private shotShip() {
      if (this.sound.isSound) {
        this.soundAudio.src = './public/assets/mp3/shot.mp3';
        this.soundAudio.volume = this.sound.volume;
        this.soundAudio.play();
      }
    }
  
    private missShip() {
      if (this.sound.isSound) {
        this.soundAudio.src = './public/assets/mp3/miss.mp3';
        this.soundAudio.volume = this.sound.volume;
        this.soundAudio.play();
      }
    }
  
    private playMusic() {
      this.musicAudio.volume = this.music.volume;
      this.musicAudio.play();
      this.musicAudio.onended = () => {
        this.musicAudio.currentTime = 0;
        this.musicAudio.play();
      };
    }
  }
  
  export default new Sound();