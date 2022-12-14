import React, {useState} from "react";

const ChooseComponent=()=>{
	const [playerShips,setPlayerShips]=useState({
		huge:1,
		big:2,
		middle:3,
		small:4
	})
	return( <div>
			{
				Object.entries(playerShips).map(sh=>{
					return <div>
						<img src='./public/assets/ship.png'/>
					</div>
				})
			}
	</div>
	)
}
export default ChooseComponent