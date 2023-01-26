import React, { useState } from 'react';
import styled from 'styled-components';
import {IRegData} from '../../dto'
import { SocketModel } from '../../socketModel';
import Wrapper from '../styledComponents/wrapper';
import { backGroundColor, generalColor } from '../../styleConst'
import Title from '../styledComponents/title';
import SubTitle from '../styledComponents/subTitle';
import { ButtonGeneral } from '../styledComponents/buttons'
import Input from '../styledComponents/input';
import Error from '../styledComponents/errorForInput';
import Content from '../styledComponents/content'

interface IRegistratoon {
    socket:SocketModel
}

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
        if(name.length>=0){
               socket.reg({name})
        }else {
            setError(true);
        }
    
    }
    return (
        <Wrapper>
            <Content>
                <Title textAlign={'center'}>Battleship</Title>
                <SubTitle textAlign={'center'}>Please, write your name</SubTitle>
                <form>
                    <InputContainer>
                        <Input handlerChange={handlerName} placeHolder="login" value={name}/>
                        {error?<Error>Minimum 5 characters</Error>:''}
                    </InputContainer>
                    <ButtonGeneral onClick={handleClick}>Submit</ButtonGeneral> 
                </form>               
            </Content>            
        </Wrapper>  
    )
} 

export default Registration;