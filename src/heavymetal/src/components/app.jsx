import SidePanel from "./side-panel";
import ViewPort from "./viewport";

export default function App() {
  return (
    <>
      <section className="app-wrapper">
        <section className="side-panel">
          <SidePanel />
        </section>

        <section className="viewport">
          <ViewPort />
        </section>
      </section>
    </>
  )
}