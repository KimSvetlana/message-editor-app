import ReactDOM from 'react-dom/client';
import './index.css';
import {  BrowserRouter as Router,  Route,  Routes } from 'react-router-dom';
import StartPage from './components/startPage/startPage';
import MessageEditor from './components/messageEditor/messageEditor';
import { loadVariables, loadTemplate, saveTemplate} from "./utils";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <Router>      
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/editor" element={<MessageEditor variableNames={loadVariables()} template={loadTemplate()} saveFunction={saveTemplate}/>} />
        </Routes>
    </Router>
);

