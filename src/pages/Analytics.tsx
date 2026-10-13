// import { Box } from '@chakra-ui/react';
//
// const Analytics = () => <Box>📈 Графики и метрики эффективности</Box>;
// export default Analytics
// Home.jsx
import React, { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';

// Импортируем все данные
import { salesData, salesPieData, viewsData, viewsPieData, chartConfigs } from 'src/chartData';

const Home = () => {
  // Состояние для хранения текущего типа данных: 'sales' или 'views'
  const [dataType, setDataType] = useState('sales');
  
  // Динамически выбираем массивы данных в зависимости от состояния
  const currentLineData = dataType === 'sales' ? salesData : viewsData;
  const currentPieData = dataType === 'sales' ? salesPieData : viewsPieData;
  
  // Получаем настройки названий и цветов для выбранного режима
  const currentConfig = chartConfigs[dataType];
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Панель управления</h1>
      
      {/* Блок с кнопками переключения */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setDataType('sales')}
          style={{
            padding: '10px 20px',
            backgroundColor: dataType === 'sales' ? '#007bff' : '#f0f0f0',
            color: dataType === 'sales' ? 'white' : 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Получить Продажи
        </button>
        
        <button
          onClick={() => setDataType('views')}
          style={{
            padding: '10px 20px',
            backgroundColor: dataType === 'views' ? '#ff7300' : '#f0f0f0',
            color: dataType === 'views' ? 'white' : 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Получить Просмотры
        </button>
      </div>
      
      {/* Блок с графиками (код разметки остался почти прежним, но стал динамическим) */}
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* 1. Линейный график */}
        <div style={{ width: '500px', height: '300px' }}>
          <h3>{currentConfig.titleMain}</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentLineData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {currentConfig.lines.map((line) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  name={line.name}
                  stroke={line.color}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* 2. Круговая диаграмма */}
        <div style={{ width: '300px', height: '300px' }}>
          <h3>{currentConfig.titlePie}</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={currentPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {currentPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      
      </div>
    </div>
  );
};

export default Home;

