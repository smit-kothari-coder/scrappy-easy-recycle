
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Leaf } from 'lucide-react';
// import { toast } from 'sonner';

// const PointsSection = () => {
//   const mockPoints = 150;
//   const mockImpact = {
//     trees: 2,
//     kgRecycled: 50
//   };

//   const rewardOptions = [
//     { points: 50, reward: "₹50 off next pickup" },
//     { points: 100, reward: "₹100 off next pickup" },
//     { points: 200, reward: "Free pickup (up to 20kg)" }
//   ];

//   const handleRedeem = (points: number, reward: string) => {
//     toast.success(`Redeemed: ${reward}`);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="bg-green-50 p-6 rounded-lg text-center">
//         <h3 className="text-2xl font-semibold text-green-700 mb-2">
//           {mockPoints} Points
//         </h3>
//         <p className="text-green-600">Earn 10 points per kg recycled!</p>
//       </div>

//       <div className="grid gap-4">
//         <h3 className="text-xl font-semibold">Available Rewards</h3>
//         {rewardOptions.map((option, index) => (
//           <Card key={index}>
//             <CardContent className="p-4 flex justify-between items-center">
//               <div>
//                 <p className="font-medium">{option.reward}</p>
//                 <p className="text-sm text-gray-500">{option.points} points required</p>
//               </div>
//               <Button
//                 variant="outline"
//                 disabled={mockPoints < option.points}
//                 onClick={() => handleRedeem(option.points, option.reward)}
//               >
//                 Redeem
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="bg-blue-50 p-6 rounded-lg">
//         <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
//           <Leaf className="w-5 h-5 text-green-600" />
//           Your Recycling Impact
//         </h3>
//         <div className="grid grid-cols-2 gap-4 text-center">
//           <div>
//             <p className="text-2xl font-semibold text-green-700">{mockImpact.trees}</p>
//             <p className="text-sm text-gray-600">Trees Saved</p>
//             <p className="text-xs text-gray-500">(1 tree per 25kg)</p>
//           </div>
//           <div>
//             <p className="text-2xl font-semibold text-green-700">{mockImpact.kgRecycled}kg</p>
//             <p className="text-sm text-gray-600">Waste Recycled</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PointsSection;
