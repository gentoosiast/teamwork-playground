import imageObj from "./Image";
import {imagesObjType} from "../components/application/app";

//todo imagesStore?????
export function createImagesObject(base: number, sizes: Record<string, number>, callBack: (obj: imagesObjType) => void) {
	const sizesArr: string[] = ['small', 'medium', 'large', 'huge']

	const imagesObjects: () => Promise<imagesObjType> = () => {
		return new Promise((resB, rej) => {
			const allVertical = Promise.all(
				Object.entries(sizes).map(c => imageObj(`./public/assets/ships/${c[0]}.png`, base, c[1]))
			)

			allVertical.then(vert => {
				const allHorizont = Promise.all(
					Object.entries(sizes).map(c => imageObj(`./public/assets/ships/${c[0]}H.png`, c[1], base)))
				allHorizont.then(hor => {
					const brokenShip = imageObj(`./public/assets/ships/fair.png`, base, base)
						.then((brokenShipImg:HTMLImageElement) => {
							const bgImg = imageObj(`./public/assets/bgCanvas.png`, base, base).then((bgImg:HTMLImageElement) => {
								const hO: Record<string, HTMLImageElement> = {}
								const vO: Record<string, HTMLImageElement> = {}
								const sizesA = ['small', 'medium', 'large', 'huge']
								sizesA.forEach((sz, ind) => {
									// @ts-ignore
									hO[sz] = hor[ind]
								})
								sizesA.forEach((sz, ind) => {
									// @ts-ignore
									vO[sz] = vert[ind]
								})
								// @ts-ignore
								const obj: imagesObjType = {}
								obj.vertical = vO
								obj.horizont = hO
								obj.broken = brokenShipImg;
								obj.bgImg = bgImg
								callBack(obj)
							})
						})
				})
			})
		})
	}
	const imgs: Promise<imagesObjType> = imagesObjects()

	imgs.then(d => {
		console.log(imgs, '****', d)
		//	setImagesObj(prev => ({...prev, vertical: d.vert, horizont: d.hor}))
	})

}