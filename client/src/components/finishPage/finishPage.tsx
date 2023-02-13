import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IUserInitialData } from "../../dto";
import { changePage } from "../../reducer/pagesReducer";
import Content from "../styledComponents/content";
import SubTitle from "../styledComponents/subTitle";
import Wrapper from "../styledComponents/wrapper";

interface IUserStore {
    userData: IUserInitialData;
  }
const FinishPage=()=>{
    const winner = useSelector((state: IUserStore) => state.userData.winner);
    const dispatch= useDispatch()
    setTimeout(()=>{
      dispatch(changePage({page:'room'}))
    },5000)
    return (
      <Wrapper>
        <Content>
          <SubTitle>{winner?'You Winner':'You loser'}</SubTitle>
        </Content>
      </Wrapper>    
    )
}

export default FinishPage;