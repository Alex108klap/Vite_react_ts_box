
function Input() {
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'max-content 1fr', // 1-я колонка по ширине текста, 2-я — на всю оставшуюся ширину
    gap: '10px',                           // Расстояние между строками и колонками
    alignItems: 'center',                  // Центрирование по вертикали
    backgroundColor: '#000',               // Черный фон как на картинке
    padding: '15px',
    width: '300px'
  };
  
  const labelStyle = {color: '#e5c158'}; // Золотистый цвет текста
  const inputStyle = {
    backgroundColor: '#333',
    border: 'none',
    color: '#fff',
    padding: '4px'
  };
  
  return (
    <div style={containerStyle}>
      <label htmlFor="search-en" style={labelStyle}>Search:</label>
      <input id="search-en" placeholder="input text ..." type="text"
             style={inputStyle}/>
      
      <label htmlFor="search-ru" style={labelStyle}>Поиск:</label>
      <input id="search-ru" type="text" style={inputStyle}/>
    </div>
  );
}
export default Input;