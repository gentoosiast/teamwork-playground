export default function imageObj(url:string,width:number,height:number){
	return new Promise((res,rej)=>{
		const image = new Image()
		image.src = url
		image.width = width
		image.height = height
		image.onload = () => {
			res(image)
		}
	})
}
