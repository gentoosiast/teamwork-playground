import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IUserInitialData } from "../../dto";
import { changePage } from "../../reducer/pagesReducer";
import { ButtonGeneral } from "../styledComponents/buttons";
import Content from "../styledComponents/content";
import SubTitle from "../styledComponents/subTitle";
import Title from "../styledComponents/title";
import Wrapper from "../styledComponents/wrapper";

interface IUserStore {
    userData: IUserInitialData;
  }
const FinishPage=()=>{
    const winner = useSelector((state: IUserStore) => state.userData.winner);
    const dispatch= useDispatch()
    return (
      <Wrapper>
        <Content>
          <Title textAlign={'center'}>{winner?'You Winner':'You loser'}</Title>
          <ButtonGeneral onClick={()=>dispatch(changePage({page:'room'}))}>Back to main</ButtonGeneral>
        </Content>
      </Wrapper>    
    )
}

export default FinishPage;