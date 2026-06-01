import {Routes, Route , Navigate} from "react-router-dom" ;
import BookTable from "./components/BookList";
import AddBook from "./components/BookForm";
import { Toaster } from "react-hot-toast";

function MainRoutes (){
    return (
        <div>
            <Toaster position="top-center"/>
        <Routes> 
            <Route path="/" element = { <Navigate to= "/books" />}></Route>
            <Route path = "/books" element= { <BookTable /> }></Route>
            <Route path = "/books/new" element= { <AddBook/> }></Route>
            <Route path = "/books/:id/edit" element = { <AddBook/>} ></Route>
            {/* <Route path="/history/:id"></Route> */}
        </Routes>
        </div>
    )
}

export default MainRoutes;