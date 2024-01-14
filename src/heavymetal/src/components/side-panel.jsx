import { Link } from 'react-router-dom';

export default function SidePanel() {
  return (
    <section className="side-panel-nav">
      <Link to="/"><button>Log</button></Link>
      <Link to="/mgmt"><button>Exercise Management</button></Link>
    </section>
  )
}