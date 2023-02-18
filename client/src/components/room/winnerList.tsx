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
    margin: 20px;
    width:330px;    
    max-height: 90vh;
    border-radius: 10px;
    border: 1px solid ${generalColor};
    overflow: auto;
    background-color: ${backGroundColorOpacity} ;
`

const Table = styled.table` 
    width: 100%;
    border-collapse: collapse;   
    text-align: center;
`;
const TD = styled.td`
    border: 1px solid ${generalColor};
`;
const TH = styled.th`
    border: 1px solid ${generalColor};
`
const WinnerList = ()=>{
    const winners = useSelector((state: IWinnerStore) => state.winnerData.winners);
    const content = !winners.length?'':
    (<WinnerContainer>
        <SubTitle>Best players</SubTitle>
        <Table>
            <thead>
                <tr key={0}>
                    <TH>N</TH>
                    <TH>Name</TH>
                    <TH>Poins</TH>
                </tr>
            </thead>            
        {winners.map((it,ind)=>{
            return(
                <tbody key={ind+1}>
                    <tr key={ind+1}>
                        <TD>{ind+1}</TD>
                        <TD>{it.name}</TD>
                        <TD>{it.wins}</TD>
                    </tr>
                </tbody>
           
            )
        })}
    </Table>
    </WinnerContainer>);
    
    return  (<>
        {content}        
    </>);
}
export default WinnerList;