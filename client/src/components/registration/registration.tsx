import React, { useState } from 'react';
import styled from 'styled-components';
import {IRegData} from '../../dto'
import { SocketModel } from '../../socketModel';
import BackGround from '../bg/background';
import {generalColor,fontSize} from '../../styleConst'
interface IRegistratoon {
    socket:SocketModel
}
const {fontLarge, fontMiddle, fontSmall} = fontSize

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`
const Content = styled.div`
    margin-top:calc(50vh - 235px);   
    background-color: #fffea69d ;
    padding: 50px;
    border-radius: 50px;
`
const Title = styled.h1`
    font-size: ${fontLarge[1080]};
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 5px;
`
const Subtitle= styled.p`
    margin-top: 20px;
    font-size: ${fontMiddle[1080]};
    text-align: center;
`
const Input = styled.input`
    margin:0 auto;
    margin-top: 20px;
    font-size:${fontMiddle[1080]};
    padding: 5px 20px;
    border: 1px soled ${generalColor};
    border-radius: 10px;
`
const Button = styled.button`  
    display: block;
    margin: 0 auto;
    margin-top: 50px;
    color: white;  
    background-color:${generalColor};
    font-size: ${fontMiddle[1080]};;
    padding: 10px 100px;
    border-radius: 20px;
    border: none;
`
const InputContainer = styled.div`
    position: relative;
`
const Error = styled.div`
    position: absolute;
    top: -10px;
    left: 10px;
    color:  white;
    background-color: red;
    font-size: ${fontSmall[1080]};;
    padding: 5px;
    border-radius: 5px;
    opacity: 0.8;
    &:after {
        content: ''; 
        position: absolute;
        left: 10px; bottom: -20px;
        border: 10px solid transparent;
        border-top: 10px solid red;
    }
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
    <BackGround>
        <Wrapper>
            <Content>
                <Title>Battleship </Title>
                <Subtitle>Please, write your name</Subtitle>
                <form>
                    <InputContainer>
                    <Input onChange={handlerName} type="text" placeholder="login" value={name}/>
                    {error?<Error>Minimum 5 characters</Error>:''}
                    </InputContainer>
                    <Button type='submit' onClick={handleClick}>Submit</Button> 
                </form>               
            </Content>            
        </Wrapper>    
    </BackGround>)
} 

export default Registration;