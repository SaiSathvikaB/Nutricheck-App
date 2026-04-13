import { useLocation } from "react-router-dom";

function Result() {

const location = useLocation();

const data = location.state;

if (!data) {
  return (
    <div style={{padding:"40px"}}>
      <h1>No result available</h1>
    </div>
  );
}

return (

<div style={{padding:"40px"}}>

<h1>Result</h1>

<p>BMI: {data.bmi}</p>

</div>

);

}

export default Result;