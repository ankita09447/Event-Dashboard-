import {BrowserRouter,Routes,Route} from "react-router-dom";
import login from "./pages/Login";
import Signup from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";

function AudioParamMap(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>} />
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/create" element ={<CreateEvent/>}/>

            </Routes>
        </BrowserRouter>
    );
}
export default App;