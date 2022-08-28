import React from "react";
import styled from "styled-components/native";
import { Dimensions } from "react-native";
import PropTypes from 'prop-types';

const StyledInput = styled.TextInput.attrs(
    ({placeholder})=>
    ({
       placeholderTextColor : '#00aaff'
    }))`
    width: ${({width})=>width-40}px;
    height: 60px;
    margin: 3px 0;
    padding: 15px 20px;
    border-radius: 10px;
    background-color: ${({theme})=>theme.itemBackground};
    font-size: 25px;
    color: ${({theme})=>theme.text};
    font-weight: bold;
`;

const Input = ({value, placeholder, onChangeText, onSubmitEditing, onBlur}) => {
    const width = Dimensions.get('window').width;

    return (
        <StyledInput 
        width={width} 
        placeholder={placeholder} 
        maxLength={50}
        value={value}
        autoCapitalize={'none'}
        returnKeyType={'done'}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onBlur={onBlur}
        />
    );
};

Input.defaultProps = {
    value:'기본값'
  }

Input.propTypes = {
    placeholder:PropTypes.string.isRequired,
    value:PropTypes.string,
    onChangeText:PropTypes.func.isRequired,
    onSubmitEditing:PropTypes.func.isRequired,
    onBlur:PropTypes.func.isRequired
}

export default Input;