export function MainPage(){
  return <div>
    <h1>Hi {localStorage.getItem('firstname')}</h1>
    
  </div>
}