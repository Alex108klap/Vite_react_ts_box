
import ParentApp from "@/components/ParentApp";
import ExempleComp from "@/components/ExempleComp";

const App =()=> {
  console.log("App renders")
  return (
 
    <>
         <ExempleComp />
            <ParentApp />
   
          </>
   )
  }
export default App;