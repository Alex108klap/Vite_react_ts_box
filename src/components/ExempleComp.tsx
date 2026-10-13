import {Box} from '@chakra-ui/react'
const Welcome =(props)=>{
  return(
          <h1 color="buttonknText" > Привет, {props.userName}! У тебя {props.messagesCount} новых сообщений.</h1>
  )
}
// 2. Используем его в главном приложении
export const ExempleComp = () => {
  return (
    <div >
      <Box color="bg.muted" mx="auto" maxW="md">
         <Welcome userName="Алексей" messagesCount={5} />
      </Box>
    </div>
  );
}
