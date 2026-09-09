export default function ToolResult({ name, status = "success", result, error }) {
  if (status === "loading") {
    return (
      <div className="tool-result" role="status" aria-label={`${name} tool running`}>
        Running {name}…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        className="tool-result tool-result--error"
        role="alert"
        aria-label={`${name} tool failed`}
      >
        {name} failed: {error}
      </div>
    );
  }

  const entries = Object.entries(result || {});

  return (
    <div className="tool-result" role="group" aria-label={`${name} result`}>
      <table>
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key}>
              <th scope="row">{key}</th>
              <td>{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
