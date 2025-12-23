import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export  const Home = ()=>{
    const navigate = useNavigate();
    return(
        <>
        <button type="submit" onClick={()=>{navigate('/Tracker')}}>Submit</button>
        </>

    );
}