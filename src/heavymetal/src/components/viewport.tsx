import {Route, Routes} from 'react-router-dom';
import Log from './log';
import Exercises from './exercises';

export default function ViewPort() {
  return (
    <Routes>
      <Route path='/' element={<Log />} />
      <Route path='/mgmt' element={<Exercises />} />
    </Routes>
  )
}