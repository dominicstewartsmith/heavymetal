import {Route, Routes} from 'react-router-dom';
import Log from './log.jsx';
import Exercises from './exercises.jsx';

export default function ViewPort() {
  return (
    <Routes>
      <Route path='/' element={<Log />} />
      <Route path='/mgmt' element={<Exercises />} />
    </Routes>
  )
}