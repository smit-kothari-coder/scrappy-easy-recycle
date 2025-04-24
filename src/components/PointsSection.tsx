import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { useSupabase } from '@/hooks/useSupabase';
import { useAuth } from '@/hooks/useAuth';
import type { Points, Reward, RedeemedReward } from '@/types';

const PointsSection = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [recyclingStats, setRecyclingStats] = useState({
    trees: 0,
    kgRecycled: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserPoints();
      fetchAvailableRewards();
      fetchRecyclingStats();
    }
  }, [user]);

  const fetchUserPoints = async () => {
    try {
      // Get all points entries for the user
      const { data: pointsData, error: pointsError } = await supabase
        .from('points')
        .select('points')
        .eq('user_id', user?.id);

      if (pointsError) throw pointsError;

      // Calculate total points
      const totalPoints = pointsData?.reduce((sum, entry) => sum + entry.points, 0) || 0;
      setPoints(totalPoints);
    } catch (error) {
      console.error('Error fetching points:', error);
      toast.error('Failed to load points');
    }
  };

  const fetchAvailableRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('active', true);

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      toast.error('Failed to load rewards');
    }
  };

  const fetchRecyclingStats = async () => {
    try {
      // Get all completed pickups for the user
      const { data: pickups, error: pickupsError } = await supabase
        .from('pickups')
        .select('weight, waste_types')
        .eq('user_id', user?.id)
        .eq('status', 'completed');

      if (pickupsError) throw pickupsError;

      // Calculate total weight and trees saved
      const totalWeight = pickups?.reduce((sum, pickup) => sum + pickup.weight, 0) || 0;
      const treesSaved = Math.floor(totalWeight / 25); // 1 tree per 25kg

      setRecyclingStats({
        trees: treesSaved,
        kgRecycled: totalWeight
      });
    } catch (error) {
      console.error('Error fetching recycling stats:', error);
      toast.error('Failed to load recycling statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (rewardId: string, pointsRequired: number) => {
    try {
      if (points < pointsRequired) {
        toast.error('Not enough points');
        return;
      }

      // Start a transaction to redeem the reward
      const { data: redemption, error: redemptionError } = await supabase
        .from('redeemed_rewards')
        .insert([
          {
            user_id: user?.id,
            reward_id: rewardId
          }
        ])
        .select()
        .single();

      if (redemptionError) throw redemptionError;

      // Deduct points
      const { error: pointsError } = await supabase
        .from('points')
        .insert([
          {
            user_id: user?.id,
            points: -pointsRequired,
            pickup_id: null,
            reward_redemption_id: redemption.id
          }
        ]);

      if (pointsError) throw pointsError;

      // Refresh points
      await fetchUserPoints();
      toast.success('Reward redeemed successfully!');
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('Failed to redeem reward');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-lg text-center">
        <h3 className="text-2xl font-semibold text-green-700 mb-2">
          {points} Points
        </h3>
        <p className="text-green-600">Earn 10 points per kg recycled!</p>
      </div>

      <div className="grid gap-4">
        <h3 className="text-xl font-semibold">Available Rewards</h3>
        {rewards.map((reward) => (
          <Card key={reward.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{reward.name}</p>
                <p className="text-sm text-gray-500">{reward.points_required} points required</p>
              </div>
              <Button
                variant="outline"
                disabled={points < reward.points_required}
                onClick={() => handleRedeem(reward.id, reward.points_required)}
              >
                Redeem
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-green-600" />
          Your Recycling Impact
        </h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold text-green-700">{recyclingStats.trees}</p>
            <p className="text-sm text-gray-600">Trees Saved</p>
            <p className="text-xs text-gray-500">(1 tree per 25kg)</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-green-700">{recyclingStats.kgRecycled}kg</p>
            <p className="text-sm text-gray-600">Waste Recycled</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsSection;
