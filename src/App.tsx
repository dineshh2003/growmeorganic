import './App.css'
// here is the imported react prime component
// index.tsx or App.tsx
import 'primereact/resources/themes/lara-light-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css';                 
import 'primeicons/primeicons.css';                              
import 'primeflex/primeflex.css';                                
import DataTableComponent from './components/DataTable';
// import Pagination from './components/Pagination';


function App() {
  return (
    <div className='container'>
      <DataTableComponent/>
    </div>
  )
}

export default App
