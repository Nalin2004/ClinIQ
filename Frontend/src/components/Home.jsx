export default function Home() {
  return (
    <div className="home-page">

      {/* HERO */}
      <section className="home-hero">
        <h1>Clinical Intelligence. Simplified.</h1>
        <h2>Turning clinical trial chaos into actionable insight.</h2>
        <span className="home-scroll">Scroll to explore ↓</span>
      </section>

      {/* DEFINITION 1 */}
      <section className="home-section">
        <h2>What is ClinIQ?</h2>
        <p>
          ClinIQ is a digital intelligence platform designed to help research teams
          detect high-risk subjects, missing data, and compliance gaps
          in real time.
        </p>
      </section>

      {/* DEFINITION 2 */}
      <section className="home-section-2">
        <h2>Why ClinIQ Exists</h2>
        <p>
          Clinical trials fail not due to lack of data but due to late detection
          of operational risk. ClinIQ identifies red flags before regulators do.
        </p>
      </section>

      {/* DEFINITION 3 */}
      <section className="home-section">
        <h2>How It Works</h2>
        <p>
          We convert fragmented clinical datasets into dynamic risk scores,
          real-time dashboards, AI-driven insights and follow-up prioritization.
        </p>
      </section>

      {/* DEFINITION 4 */}
      <section className="home-section-3">
        <h2>Who Benefits?</h2>
        <p>
          Sponsors, investigators, monitors and patients —
          everyone gains clarity, safety and speed.
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="home-cta">
        <h2>Welcome to the Future of Clinical Monitoring</h2>
        <p>Because patient safety cannot wait for spreadsheets.</p>
      </section>

    </div>
  );
}
