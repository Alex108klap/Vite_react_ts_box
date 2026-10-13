import {useState} from 'react';
// import { chakra } from "@chakra-ui/react"
import { Input } from "@chakra-ui/react";

function TaskForm({ onAddTask }) { // 1. Принимаем колбэк из пропсов
  const [text, setText] = useState('');
  
  const handleSubmit = (event) => {
    event.preventDefault(); // Отменяем перезагрузку страницы
    
    if (text.trim() === '') return;
    
    // 2. Вызываем колбэк родителя и передаем туда данные ("text")
    onAddTask(text);
    
    setText(''); // Очищаем поле ввода
  };
  
  return (
    <form onSubmit={handleSubmit}  >
      {/*<input*/}
      {/*  style={{ height: '35px', fontSize: '16px', padding: '4px',}}*/}
      {/*  type="text"*/}
      {/*  value={text}*/}
      {/*  onChange={(e) => setText(e.target.value)}*/}
      {/*  placeholder="Новая задача..."*/}
      {/*/>*/}
      
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Новая задача..."
        height="55px"
        width="400px"
        fontSize="16px"
        p="20px"
        // color="text.secondary"
        bg="brand.500"
        border="3px solid"
        borderColor="brand.600"
        borderRadius="10px"
        
        // Исправленный фокус и плейсхолдер
        _placeholder={{
          color: "brand.600"
        }}
        _focus={{
          outline: "none",
          borderColor: "brand.600", // Вместо focusBorderColor
          boxShadow: "none" // Или удалите, если не нужно свечение
        }}
      />
      
      <div>
              <button style={{color:"fg", font:"mono"}} type="submit">Добавить</button>
      </div>
    </form>
  );
}
export default TaskForm;
