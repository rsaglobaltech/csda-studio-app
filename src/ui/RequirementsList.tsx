import type { RequirementRow } from "../domain/requirements-list";

/**
 * REQ-003's view: every requirement in the loaded pack, at a glance.
 *
 * A table rather than a bare list, because the scenario is about rows with
 * named fields — the header cells are what let a reader tell a priority from a
 * status without reading the whole row.
 *
 * The component is handed rows, never a pack: the projection is UC-003's, so
 * this file holds no rule beyond how a row is drawn.
 */
export function RequirementsList({ rows }: { rows: readonly RequirementRow[] }) {
  return (
    <section aria-label="Requirements" data-testid="requirements-panel">
      <h2>Requirements</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Title</th>
            <th scope="col">Priority</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} data-testid="requirement-row">
              <td data-field="id">{row.id}</td>
              <td data-field="title">{row.title}</td>
              <td data-field="priority">{row.priority}</td>
              <td data-field="status">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
