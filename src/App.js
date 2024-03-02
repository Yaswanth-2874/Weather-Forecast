import './App.css';
import FetchingData from './components/FetchingData';

function App() {
  document.title = 'Weather forecast'
  return (
    <>
    <FetchingData></FetchingData>
    </>
  );
}

export default App;
