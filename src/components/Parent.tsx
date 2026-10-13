import {useState} from 'react'
import Child from '@/components/Child'

const Parent = () => {
  const [name, setName] = useState('')
  const handleChange = (event) => {
    setName(event.target.value)
  }
  return (
    <div style={{
      border: '1px solid gray',
      padding: '10px',
      marginTop: '10px',
      width: '300px',
      backgroundColor: 'green'
    }}>
      <label htmlFor="al">родитель: </label>
      <input id="al" type="text" value={name} onChange={handleChange}/>
      <div style={{
        border: '1px solid gray',
        padding: '10px',
        marginTop: '10px',
        width: '280px',
        backgroundColor: 'darkgreen'
      }}>
        <Child name={name}/>
      </div>
    </div>
  )
}
export default Parent;