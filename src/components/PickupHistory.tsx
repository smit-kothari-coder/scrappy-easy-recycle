
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
    }
  ];

  return (
    <div className="overflow-x-auto">
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
                <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                  {pickup.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PickupHistory;
