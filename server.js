import express from 'express';
import cors from 'cors';
import https from 'https';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/order', (req, res) => {
  const { text } = req.body;
  
  // Вшиваем полный токен и ID строго без лишних расчетов путей
  const token = '8683898576:AAEzuRpJBNqEmgbyHO5Q1kmBuhVEOBkp260';
  const chatId = '5137850732';
  
  const postData = JSON.stringify({
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown'
  });
  
  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    // СЛОВО bot ОБЯЗАТЕЛЬНО ДОЛЖНО СТОЯТЬ ПЕРЕД ТОКЕНОМ:
    path: `/bot${token}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  const telegramRequest = https.request(options, (telegramResponse) => {
    let responseBody = '';
    
    telegramResponse.on('data', (chunk) => {
      responseBody += chunk;
    });
    
    telegramResponse.on('end', () => {
      if (telegramResponse.statusCode === 200) {
        console.log('✅ ИДЕАЛЬНО! Заказ успешно отправлен в Telegram!');
        res.status(200).json({ success: true });
      } else {
        console.error('❌ ОШИБКА ОТ TELEGRAM API!');
        console.error(`Статус ответа: ${telegramResponse.statusCode}`);
        console.error(`Детали ошибки: ${responseBody}`);
        res.status(500).json({ error: 'Telegram API error', details: responseBody });
      }
    });
  });
  
  telegramRequest.on('error', (err) => {
    console.error('❌ Критическая ошибка сети на сервере:', err.message);
    res.status(500).json({ error: err.message });
  });
  
  telegramRequest.write(postData);
  telegramRequest.end();
});

app.listen(5000, () => {
  console.log('🚀 Сервер заказов успешно запущен на порту 5000!');
});