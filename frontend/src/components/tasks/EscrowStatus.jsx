const statusStyles = {
  none: "bg-gray-200 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  funded: "bg-green-100 text-green-700",
  released: "bg-blue-100 text-blue-700",
  refunded: "bg-red-100 text-red-700",
  disputed: "bg-purple-100 text-purple-700",
};

const statusLabels = {
  none: "No Escrow",
  pending: "Pending",
  funded: "Funded",
  released: "Released",
  refunded: "Refunded",
  disputed: "Disputed",
};

const EscrowStatus = ({ status = "none" }) => {
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        statusStyles[status] || statusStyles.none
      }`}
    >
      {statusLabels[status] || "Unknown"}
    </span>
  );
};

export default EscrowStatus;
