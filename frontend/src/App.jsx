import { useState } from 'react'
import SignUp from './components/SignUp'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import './App.css'

const router = createBrowserRouter([
  
  {
    path:"/register",
    element:<SignUp/>
  },
  
])

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
