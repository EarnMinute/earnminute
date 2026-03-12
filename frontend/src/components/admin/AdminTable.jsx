function AdminTable({ columns, data, emptyMessage }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        {emptyMessage || "No data found"}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            {columns.map((col) => (
              <th key={col.key} className="pb-3">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row._id} className="border-b">
              {columns.map((col) => (
                <td key={col.key} className="py-3">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
