import React, { useState } from 'react';
import styled from 'styled-components';
import {IRegData} from '../../dto'
import { SocketModel } from '../../socketModel';
import BackGround from '../bg/background';
interface IRegistratoon {
    socket:SocketModel
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`
const Content = styled.div`
    margin-top:200px;    
`
const Title = styled.h1`
    font-size: 80px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 5px;
`
const Subtitle= styled.p`
    margin-top:50px;
    font-size: 40px;
    text-align: center;
`
const Input = styled.input`
    margin:0 auto;
    margin-top: 20px;
    font-size: 40px;
`
const Button = styled.button`  
    display: block;
    margin: 0 auto;
    margin-top: 50px;
    color: white;  
    background-color: rgb(0, 33, 94);
    font-size: 40px;
    padding: 10px 100px;
    
`
const Registration = ({socket}:IRegistratoon)=>{
    const [name, setName] = useState('')
    const handlerName = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setName(e.target.value)
    }

    return (
    <BackGround>
        <Wrapper>
            <Content>
                <Title>Battleship </Title>
                <Subtitle>Please, write your name</Subtitle>
                <Input onChange={handlerName} type="text" placeholder="login" value={name} min={5}/>

                <Button onClick={()=>socket.reg({name})}>Submit</Button> 
            </Content>
            
        </Wrapper>    
    </BackGround>)
} 

export default Registration;