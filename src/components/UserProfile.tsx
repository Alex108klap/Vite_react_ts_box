import {useState} from 'react'

const UserProfile = () => {
  const [likes, setLikes] = useState(0)
  
  const handleLikeClick = () => {
    setLikes((prevLiks) => prevLiks +1)
  }
  
  return (
    <div>
      <p> Лайков: {likes}</p>
      <button onClick={handleLikeClick}> Поставь лайк: {likes}</button>
    </div>
  )
}
export default UserProfile;