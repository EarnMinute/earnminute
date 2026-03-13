function EscrowStatus({ escrow }) {
  if (!escrow) return null;

  if (escrow.status === "funded") {
    return (
      <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
        Escrow Funded
      </span>
    );
  }

  return (
    <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
      Awaiting Escrow Funding
    </span>
  );
}

export default EscrowStatus;
