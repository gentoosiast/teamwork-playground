import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, ISetting} from "../dto";

class Sound {
    private musicAudio: HTMLAudioElement;  
    private missAudio: HTMLAudioElement;
    private killAudio: HTMLAudioElement;
    private shotAudio: HTMLAudioElement;
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
      this.missAudio = new Audio();
      this.missAudio.currentTime = 0;
      this.missAudio.src = './public/assets/mp3/miss.mp3';

      this.killAudio = new Audio();
      this.killAudio.currentTime = 0;
      this.killAudio.src = './public/assets/mp3/killed.mp3';

      this.shotAudio = new Audio();
      this.shotAudio.currentTime = 0;
      this.shotAudio.src = './public/assets/mp3/shot.mp3';

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
      if (this.sound.isSound&&!(this.killAudio.currentTime > 0 && !this.killAudio.paused && !this.killAudio.ended 
        && this.killAudio.readyState > this.killAudio.HAVE_CURRENT_DATA)) {   
        this.killAudio.currentTime = 0;    
        this.killAudio.volume = this.sound.volume;
        this.killAudio.play();   
      }
    }
  
    private shotShip() {
      if (this.sound.isSound&&!(this.shotAudio.currentTime > 0 && !this.shotAudio.paused && !this.shotAudio.ended 
        && this.shotAudio.readyState > this.shotAudio.HAVE_CURRENT_DATA)) {   
        this.shotAudio.currentTime = 0;    
        this.shotAudio.volume = this.sound.volume;
        this.shotAudio.play();   
      }
    }
  
    private missShip() {
      if (this.sound.isSound&&!(this.missAudio.currentTime > 0 && !this.missAudio.paused && !this.missAudio.ended 
        && this.missAudio.readyState > this.missAudio.HAVE_CURRENT_DATA)) {   
        this.missAudio.currentTime = 0;    
        this.missAudio.volume = this.sound.volume;
        this.missAudio.play();   
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