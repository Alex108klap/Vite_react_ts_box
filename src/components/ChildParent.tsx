import {useState} from 'react'

// const Child = ({onFuncton}) => {
//   const handleClick = () => {
//     onFuncton('Привет от дочки')
//   }
//   return (
//     <div style={{ border: '2px solid blue', padding: '20px' }}>
//       <h2>Дочерный компонент</h2>
//       <button onClick={handleClick}>Отправить привет родителю</button>
//     </div>
//
//   )
// }

 const ChildParent = () => {
  const [messege, setMessege] = useState('жду весточку от дочки')
  
   // callback function
  const handleChildData = (dat) => {
        setMessege(dat)
  }
    return (
    <div style={{ border: '1px solid gray', padding: '10px', marginTop: '10px' }}>
      <p>Родитель</p>
      <p> Статус: {messege}</p>
      <Child onFuncton={handleChildData} />
    </div>
  )
}
export default ChildParent;

//Child через пропс получает callback onFuncton={handleChildData}
const Child = ({onFuncton}) => {
  const handleClick = () => {
    onFuncton('Привет от дочки') // callback function
  }
  return (
    <div style={{ border: '2px solid blue', padding: '20px' }}>
      <h2>Дочерный компонент</h2>
      <button onClick={handleClick}>Отправить привет родителю</button>
    </div>
    )
}
