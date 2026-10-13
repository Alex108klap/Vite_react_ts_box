const Hr = ()=> (
  
    <hr style= {{height: "2px",
      backgroundColor: "#3b82f6", // Красивый синий цвет (как в Tailwind)
      border: "none",            // Убираем стандартную серую рамку
      borderRadius: "5px",       // Скругляем края линии
      margin: "20px 0",
      width: "230px",
      // Добавляем отступы сверху и снизу
    }}   />
)

export default Hr;