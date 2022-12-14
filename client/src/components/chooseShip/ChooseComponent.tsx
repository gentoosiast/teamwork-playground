import React, {useEffect, useRef, useState} from "react";

const ChooseComponent = () => {
	const [playerShips, setPlayerShips] = useState({
		huge: 1,
		big: 2,
		middle: 3,
		small: 4
	})
	const canvasRef = useRef(null)
	useEffect(() => {
console.log(canvasRef.current,'R')
	}, [])
	return (<div style={{border: '1px solid gray', width: '70px'}}>
			<h5>Расставьте корабли</h5>
			{
				Object.entries(playerShips).map((sh, i) => {
					return <div style={{
						width: '70px', borderBottom: '1px solid gray',
						display: "flex"
					}}>

						<span>{sh[1]}</span>
						<span style={{flexGrow: '10', textAlign: 'center'}}>
							<img src='./public/assets/ship.png'
									 style={{width: `${50 / (i + 1)}px`}}
							/>
						</span>

					</div>
				})
			}
			<canvas ref={canvasRef}/>
		</div>
	)
}
export default ChooseComponent



