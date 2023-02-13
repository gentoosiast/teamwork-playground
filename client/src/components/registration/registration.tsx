import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {IRegData, IUserInitialData} from '../../dto'
import { SocketModel } from '../../socketModel';
import Wrapper from '../styledComponents/wrapper';
import { backGroundColorOpacity, generalColor } from '../../styleConst'
import Title from '../styledComponents/title';
import SubTitle from '../styledComponents/subTitle';
import { ButtonGeneral } from '../styledComponents/buttons'
import Input from '../styledComponents/input';
import Error from '../styledComponents/errorForInput';
import Content from '../styledComponents/content'
import { useSelector } from 'react-redux';

interface IRegistratoon {
    socket:SocketModel
}

const InputContainer = styled.div`
    position: relative;
`
interface IUserStore {
    userData: IUserInitialData;
}

const Registration = ({socket}:IRegistratoon)=>{
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const userData = useSelector( (state: IUserStore) => state.userData);
    const handlerName = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setName(e.target.value);
        setError(false);
    }
    const handlerPassword = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setPassword(e.target.value);
        setError(false);
    }
    const handleClick = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        if(name.length<5){
            setError(true);
            setErrorText('Minimum 5 characters');
        } else if(password.length<5){
            setError(true);
            setErrorText('Add password minimum 5 characters');
        } else{
            socket.reg({name,password})
        }
    }
    useEffect(()=>{
        setError(userData.error);
        setErrorText(userData.errorText)
    },[userData])
    return (
        <Wrapper>
            <Content>
                <Title textAlign={'center'}>Battleship</Title>
                <SubTitle textAlign={'center'}>Please, write your name</SubTitle>
                <form>
                    <InputContainer>
                        <Input handlerChange={handlerName} placeHolder="login" value={name}/>
                        {isError?<Error>{errorText}</Error>:''}
                        <SubTitle textAlign={'center'}>Please, write your password</SubTitle>
                        <Input handlerChange={handlerPassword} placeHolder="password" value={password} type='password'/>
                    </InputContainer>
                    <ButtonGeneral onClick={handleClick}>Submit</ButtonGeneral> 
                </form>               
            </Content>            
        </Wrapper>  
    )
} 

export default Registration;