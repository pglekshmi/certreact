import { useState,useEffect } from "react";
import {BrowserProvider,Contract} from 'ethers';
import abi  from './Cert.json'
import address from './deployed_addresses.json';


function App() {

  const [formData,setFormData] = useState({
    ID:0,
    Name:'',
    Course:'',
    Grade:'',
    Date:''
  });

  const [output,setOutput] = useState("");
  
  const provider = new BrowserProvider(window.ethereum);
  async function connectMetamask(){
    const signer = await provider.getSigner();
    console.log(signer.address);
    
    alert(`${signer.address} successfully logged in`);
  
  }

  function handleChange(event){
    const {name,value} = event.target;
    setFormData((prevState)=>({...prevState,[name]:value }))
    console.log(formData);
    
    
  }

  async function handleForm(event){
     event.preventDefault();
     console.log("Hi");
     console.log(formData);
     
     const ABI=abi.abi;
     const add = address["CertModule#Cert"];
     const signer =  await provider.getSigner();
     console.log(signer);
     
     
     const instance = new Contract(add,ABI,signer);
     console.log(instance);

     const receipt1 = await instance.issue(formData.ID,
                                          formData.Name,
                                          formData.Course,
                                          formData.Grade,
                                          formData.Date
     );
     
     console.log(receipt1);
     resetForm();
     
  }

  function resetForm(){
    setFormData({ID:0,
      Name:'',
      Course:'',
      Grade:'',
      Date:''})
      document.getElementById("ID").value='';
      document.getElementById("Name").value='';
      document.getElementById("Course").value='';
      document.getElementById("Date").value='';
  }

  async function getCertificate(){
    const queryId = document.getElementById("queryId").value;
    console.log(queryId);

    const ABI=abi.abi;
    const add = address["CertModule#Cert"];
    const signer =  await provider.getSigner();
    console.log(signer);
    
    
    const instance = new Contract(add,ABI,signer);
    console.log(instance);

     const txValue = await instance.Certificates(queryId);
     console.log(txValue);
     
     if(txValue){
      setOutput(`Name:${txValue[0]},Course:${txValue[1]},Grade:${txValue[2]},Date:${txValue[3]}`)
     }
  }
  return (
  <div>
    <br></br>
    <input type='button' value='Connect Metamask' onClick={connectMetamask}/>
    <br>
    </br>
    <br />
    <form onSubmit={handleForm}>
      <div>
      <label>ID:</label>
      <input type='number' id="ID" name="ID" onChange={(e)=>{setFormData((preState)=>({
                          ...preState,[e.target.name]:e.target.value
      }))}}></input>
      </div>
      <div>
      <label>Name:</label>
      <input type='text' id="Name" name="Name" onChange={handleChange} />
      </div>
      <div>
      <label>Course:</label>
      <input type='text' id="Course" name="Course" onChange={handleChange}/>
      </div>
      <div>
      <label>Grade:</label>
      <input type='text' id="Grade" name="Grade" onChange={handleChange} />
      </div>
      <div>
      <label>Date:</label>
      <input type='date' id="Date" name="Date" onChange={handleChange}/>
      </div>
      <br />
      <div>
      <input type='submit' value='Submit' />
      <input type='button' value='Reset' onClick={resetForm}/>
      </div>
    </form>
   <br />
   <br />
    <div>
      <input type="text" name="queryId"  id="queryId"/>
      <button onClick={getCertificate}>Get Certificate</button>
    </div>
    <p>{output}</p>
  </div>
  );
}

export default App;
