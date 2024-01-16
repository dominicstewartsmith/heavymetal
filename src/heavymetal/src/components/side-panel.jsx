import { Link } from 'react-router-dom';
import { GiWeightLiftingUp } from "react-icons/gi";
import { FaCalendarAlt } from "react-icons/fa";

export default function SidePanel() {
  return (
    <section className="side-panel-container">
      <Link to="/"><FaCalendarAlt className='side-panel-log'/></Link>
      <p className='side-panel-text'>Daily Workout Log</p>
      <Link to="/mgmt"><GiWeightLiftingUp className='side-panel-mgmt'/></Link>
      <p className='side-panel-text'>Exercise Management</p>
    </section>
  )
}