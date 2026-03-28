import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

const API_BASE = "http://localhost:3000";

function CreateAdminForm() {
  const { getAccessTokenSilently } = useAuth0();
  const [universityId, setUniversityId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setBusy(true);
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_BASE}/iam/admin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          universityId,
          firstName,
          lastName,
          email,
        }),
      });

      const text = await res.text();
      if (!res.ok) {
        setStatus(`Error ${res.status}: ${text || res.statusText}`);
        return;
      }

      let personId = text;
      try {
        const json = JSON.parse(text) as { personId?: string };
        if (json.personId) personId = json.personId;
      } catch {
        /* body might be empty */
      }
      setStatus(`Created admin. personId: ${personId}`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Create admin</h2>
      <div>
        <label>
          universityId
          <input
            value={universityId}
            onChange={(e) => setUniversityId(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          firstName
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          lastName
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit" disabled={busy}>
        {busy ? "Submitting…" : "Submit"}
      </button>
      {status && <pre>{status}</pre>}
    </form>
  );
}

export default CreateAdminForm;
