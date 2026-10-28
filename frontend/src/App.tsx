
import { useEffect, useState } from "react";
import "./style.css";

type Item = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
};

const API = "http://127.0.0.1:8000/tasks";
const FIELDS = ["title", "description", "status", "priority", "assignee"];

const EMPTY = {
  title: "",
  description: "",
  status: "",
  priority: "",
  assignee: "",
} as Record<string, string | number>;

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(EMPTY).map(([key, value]) => [key, String(value)])
    )
  );
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function load(q = query) {
    try {
      const res = await fetch(
        `${API}${q ? `?q=${encodeURIComponent(q)}` : ""}`
      );

      if (!res.ok) throw new Error();

      setItems(await res.json());
      setError("");
    } catch {
      setError("API unavailable. Start the FastAPI backend on port 8000.");
    }
  }

  useEffect(() => {
    void load("");
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(query), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  async function save(e: React.FormEvent) {
    e.preventDefault();

    const body: Record<string, string | number> = { ...form };

    for (const key of FIELDS) {
      if (["quantity", "price", "amount"].includes(key)) {
        body[key] = Number(form[key] || 0);
      }
    }

    try {
      const res = await fetch(
        editing === null ? API : `${API}/${editing}`,
        {
          method: editing === null ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error("Could not save record");

      setForm(
        Object.fromEntries(
          Object.entries(EMPTY).map(([key, value]) => [key, String(value)])
        )
      );
      setEditing(null);
      await load();
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  function edit(item: Item) {
    setEditing(item.id);
    setForm(
      Object.fromEntries(
        FIELDS.map((key) => [
          key,
          String(
            (item as unknown as Record<string, unknown>)[key] ?? ""
          ),
        ])
      )
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: number) {
    if (!window.confirm("Delete this record?")) return;

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });

      if (res.ok) {
        await load();
      } else {
        setError("Delete failed");
      }
    } catch {
      setError("Delete failed. Check that the backend is running.");
    }
  }

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <h1>Team Task Manager</h1>
        </div>

        <div className="counter">
          <strong>{items.length}</strong>
          <span>visible records</span>
        </div>
      </header>

      {error && <div className="alert">{error}</div>}

      <section className="panel">
        <h2>
          {editing === null ? "Create record" : `Edit record #${editing}`}
        </h2>

        <form className="form-grid" onSubmit={save}>
          {FIELDS.map((key) => (
            <label key={key}>
              {key.replaceAll("_", " ")}
              <input
                required
                value={form[key] ?? ""}
                onChange={(e) =>
                  setForm((old) => ({ ...old, [key]: e.target.value }))
                }
              />
            </label>
          ))}

          <div className="actions">
            <button type="submit">
              {editing === null ? "Add record" : "Save changes"}
            </button>

            {editing !== null && (
              <button
                className="secondary"
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm(
                    Object.fromEntries(
                      Object.entries(EMPTY).map(([key, value]) => [
                        key,
                        String(value),
                      ])
                    )
                  );
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="list-heading">
          <div>
            <h2>Records</h2>
            <p>{items.length} record(s)</p>
          </div>

          <input
            className="search"
            placeholder="Search records..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {items.length === 0 ? (
          <div className="empty">
            No records yet. Add one above to get started.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  {FIELDS.map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>

                    {FIELDS.map((key) => (
                      <td key={key}>
                        {String(
                          (item as unknown as Record<string, unknown>)[key]
                        )}
                      </td>
                    ))}

                    <td className="row-actions">
                      <button
                        className="small secondary"
                        onClick={() => edit(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="small danger"
                        onClick={() => void remove(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer>React · TypeScript · FastAPI · SQLite · REST API</footer>
    </main>
  );
}
