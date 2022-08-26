import React,{useState} from 'react';
import styled, {ThemeProvider} from 'styled-components/native';
import theme from './theme';
import { StatusBar } from 'react-native';
import Input from './components/Input';
import Task from './components/Task';
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';


const Container = styled.View`
  flex:1;
  background-color: ${({theme}) => theme.background};
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  font-size: 40px;
  font-weight: 600;
  color: ${({theme})=>theme.main};
  align-self: center;
  margin:0 20px;
`

const List = styled.ScrollView`
  flex:1;
  width:${({width})=> width - 40}px;
  `;

export default function App() {
  const width = Dimensions.get('window').width;
  const [newTask, setNewTask ] = useState('');  
  const [isReady, setIsReady] = useState(false);
  const [tasks, setTasks] = useState({}); 

  const _handleTextChange = text => {
    setNewTask(text);
  }

  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
      setTasks(value);
    } catch (e) {
      // saving error
    }
  }

  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      console.log(jsonValue);
      const tasks = jsonValue != null ? JSON.parse(jsonValue) : {};
      setTasks(tasks);
    } catch(e) {
      console.log('데이터 가져오기:'+jsonValue);
    }
  }

  const removeValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch(e) {
      // remove error
    }
      
    console.log('항목삭제:'+key);
  }


  const clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
  
    console.log('전체 삭제 Done.')
  }


    // 추가
  const _addTask = () =>{
    console.log('입력완료');
    const ID = Date.now().toString();
    const newTaskObject = {
      [ID]:{id:ID, text:newTask, completed:false},
    };
    setNewTask('');
    storeData('tasks', {...tasks, ...newTaskObject}); 
  }

  //삭제
  const _deleteTask = id => {
    const currentTasks = {...tasks};
    delete currentTasks[id];
    storeData('tasks', currentTasks);
  }

  //완료
  const _toggleTask = id => {
    const currentTasks = {...tasks};
    currentTasks[id]['completed'] = !currentTasks[id]['completed'];
    storeData('tasks', currentTasks);
  }

  //수정
  const _updateTask = task => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[task.id] = task;
    storeData('tasks', currentTasks); 
  }

  const _onBlur = () => {
    setNewTask('');
  }

  return !isReady ? (
    <AppLoading
      startAsync={()=>{getData('tasks')}}
      onFinish={()=>setIsReady(true)}
      onError={console.error}
   />
  ):(
    <ThemeProvider theme={theme}>
      <Container>
        <StatusBar
        barStyle="light-content"
        backgroundColor={theme.background}/>
        <Title>버킷리스트</Title>
        <Input placeholder="+항목 추가"
        value = {newTask}
        onChangeText={_handleTextChange}
        onSubmitEditing={_addTask}
        onBlur={_onBlur}
        />
        <List width={width}>
          {Object.values(tasks)
                 .reverse()
                 .map(task=><Task key={task.id}
                                  task={task} 
                                  deleteTask={_deleteTask}
                                  toggleTask={_toggleTask}
                                  updateTask={_updateTask}
                            />)
          }
        </List>
        </Container>
    </ThemeProvider>
  );
}

