export const App = () => {
  const tracks = [
    {id: 1, title: ' Musicfan soundtrack', url: 'https://musicfun.it-incubator.app/api/samurai-way-soundtrack.mp3'},
    {id: 2, title: ' Musicfan soundtrack instrumental', url: 'https://musicfun.it-incubator.app/api/samurai-way-soundtrack-instrumental.mp3'},
    {id: 3, title: ' Musicfan soundtrack', url: 'https://musicfun.it-incubator.app/api/samurai-way-soundtrack.mp3'},
    {id: 4, title: ' Musicfan soundtrack instrumental', url: 'https://musicfun.it-incubator.app/api/samurai-way-soundtrack-instrumental.mp3'},
  ]
  
  
  return (
    <>
      <header>
        <h1>Musicfan Player it-Samuray</h1>
        <ul>
          
          {tracks.map((track:{title: string, url: string})=> {
            return (
              <li key={track.id}>
                <div>
                  {track.title}
                </div>
                <audio src={track.url}
                       controls></audio>
              </li>
            
            )
          })}
        
        </ul>
      </header>
    
    </>
  )
}




