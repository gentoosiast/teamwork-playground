import React from "react";
import { useSelector } from "react-redux";
import { IUserInitialData } from "../../dto";
import Content from "../styledComponents/content";
import SubTitle from "../styledComponents/subTitle";
import Wrapper from "../styledComponents/wrapper";

interface IUserStore {
    userData: IUserInitialData;
  }
const FinishPage=()=>{
    const winner = useSelector((state: IUserStore) => state.userData.winner)
    return (
      <Wrapper>
        <Content>
          <SubTitle>{winner?'You Winner':'You loser'}</SubTitle>
        </Content>
      </Wrapper>    
    )
}

export default FinishPage;