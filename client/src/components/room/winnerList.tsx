import React from 'react';
import { IUserInitialData, IWinnersState } from '../../dto';
import {backGroundColorOpacity, generalColor} from '../../styleConst';
import SubTitle from '../styledComponents/subTitle';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
interface IWinnerStore {
    winnerData: IWinnersState;
}
const WinnerContainer =styled.div`
    padding: 50px;
    width:330px;
    background-color: ${backGroundColorOpacity} ;
    max-height: 90vh;
    border-radius: 10px;
    border: 1px solid ${generalColor};
    overflow: auto;
`

const Table = styled.table`
   //border: 1px solid black;
`;
const WinnerList = ()=>{
    const winners = useSelector((state: IWinnerStore) => state.winnerData.winners);
    const content = !winners.length?'':
    (<WinnerContainer>
        <SubTitle>Best players</SubTitle>
        <Table>
            <tr key={0}>
                <th>N</th>
                <th>Name</th>
                <th>Poins</th>
            </tr>
        {winners.map((it,ind)=>{
            return(
            <tr key={ind+1}>
                <td>{ind+1}</td>
                <td>{it.name}</td>
                <td>{it.wins}</td>
            </tr>
            )
        })}
    </Table>
    </WinnerContainer>);
    
    return  (<>
        {content}        
    </>);
}
export default WinnerList;