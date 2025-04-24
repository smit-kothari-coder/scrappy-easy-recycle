
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PickupHistory = () => {
  const mockHistory = [
    {
      date: "2025-04-18",
      scrapper: "John Doe",
      weight: "10",
      type: "Metal",
      price: "100",
      status: "Completed"
    },
    {
      date: "2025-04-17",
      scrapper: "Jane Smith",
      weight: "15",
      type: "Paper",
      price: "75",
      status: "Scheduled"
    }
  ];

  return (
    <div className="overflow-x-auto">
      {mockHistory.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Scrapper</TableHead>
              <TableHead>Weight (kg)</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price (₹)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockHistory.map((pickup, index) => (
              <TableRow key={index}>
                <TableCell>{pickup.date}</TableCell>
                <TableCell>{pickup.scrapper}</TableCell>
                <TableCell>{pickup.weight}</TableCell>
                <TableCell>{pickup.type}</TableCell>
                <TableCell>{pickup.price}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    pickup.status === "Completed" 
                      ? "text-green-800 bg-green-100" 
                      : "text-blue-800 bg-blue-100"
                  }`}>
                    {pickup.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <p>No pickups yet</p>
        </div>
      )}
    </div>
  );
};

export default PickupHistory;
