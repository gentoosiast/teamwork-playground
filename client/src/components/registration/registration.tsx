import React, { useState } from 'react';
import styled from 'styled-components';
import {IRegData} from '../../dto'
import { SocketModel } from '../../socketModel';
import Wrapper from '../styledComponents/wrapper';
import {generalColor,fontSize} from '../../styleConst'
import Title from '../styledComponents/title';
import SubTitle from '../styledComponents/subTitle';
import Button from '../styledComponents/button'
import Input from '../styledComponents/input';
import Error from '../styledComponents/errorForInput';

interface IRegistratoon {
    socket:SocketModel
}
const {fontMiddle, fontSmall} = fontSize

const Content = styled.div`
    background-color: #fffea69d ;
    padding: 50px;
    border-radius: 50px;
`

const InputContainer = styled.div`
    position: relative;
`

const Registration = ({socket}:IRegistratoon)=>{
    const [name, setName] = useState('');
    const [error, setError] = useState(false)
    const handlerName = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setName(e.target.value);
        setError(false);
    }
    const handleClick = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        if(name.length>=5){
               socket.reg({name})
        }else {
            setError(true);
        }
    
    }
    return (
        <Wrapper>
            <Content>
                <Title>Battleship </Title>
                <SubTitle>Please, write your name</SubTitle>
                <form>
                    <InputContainer>
                        <Input handlerChange={handlerName} placeHolder="login" value={name}/>
                        {error?<Error>Minimum 5 characters</Error>:''}
                    </InputContainer>
                    <Button onClick={handleClick}>Submit</Button> 
                </form>               
            </Content>            
        </Wrapper>  
    )
} 

export default Registration;