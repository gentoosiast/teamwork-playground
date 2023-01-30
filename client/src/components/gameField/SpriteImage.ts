export default class SpriteImage{
	private img: HTMLImageElement;
	constructor(url:string) {
		this.img = new Image();
		// this.img.onload = function() {
		//
		// };
		this.img.src = url;
	}
show(){
		console.log(this.img)
}
}