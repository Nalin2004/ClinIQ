export default function UserPortal() {
  return (
    <div className="user-portal-page">
      <div className="user-portal-card">
        <h1>ClinIQ User Access Portal</h1>
        <p className="restricted-text">
          🔒 Access Restricted — You are logged in as a standard user.
        </p>

        <div className="user-info">
          <p>
            This portal provides an overview of the ClinIQ platform without
            exposing sensitive clinical data.
          </p>

          <ul>
            <li>✔ AI-powered risk analysis engine</li>
            <li>✔ Secure authentication & role based access</li>
            <li>✔ Real-time data quality monitoring</li>
            <li>✔ Automated subject performance analytics</li>
          </ul>
        </div>

        <div className="user-footer">
          <p>
            For full access, please contact the ClinIQ administrator team.
          </p>
        </div>
      </div>
    </div>
  );
}
