export default React =>
  function Page() {
    return (
      <div>
        <ul>
          {Array(1e4).fill(1).map((x, y) => x + y).map(e =>
            <li key={e}>
              item {e}
            </li>,
          )}
        </ul>
      </div>
    );
  };
