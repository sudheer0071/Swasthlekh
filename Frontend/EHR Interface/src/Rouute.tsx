import { useNavigate } from "react-router-dom";
import { Button } from "./components/Button"; 

export function Rouute(){
  const navigate = useNavigate(); 
  const handleUserClick = () => {
    console.log('hidfs');
    
    navigate('/users/signup');
  };

  const handleDoctorClick = () => {
    navigate('/doctors/signup');
  };

  return  <div> 
    <h1 className="flex justify-center text-slate-700">Swasth lekh Deployment Check </h1>
      <div>
        <Button label={'user'} height={12} loader={''} onclick={handleUserClick}></Button>
      </div>
      <div>
        <Button label={'doctor'} height={12} loader={''} onclick={handleDoctorClick}></Button>
      </div> 
  </div>
}