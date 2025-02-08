import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

export const useGetCalls = () => {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user?.id) return;
      
      setIsLoading(true);

      try {
        // Query the calls from the Stream Video client with filter conditions
        const { calls } = await client.queryCalls({
          sort: [{ field: 'starts_at', direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
        });

        setCalls(calls);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalls();
  }, [client, user?.id]);

  const now = new Date();

  const endedCalls = calls.filter(({ state: { startsAt, endedAt } }: Call) => {
    // Explicitly handle missing startsAt or endedAt
    const startDate = startsAt ? new Date(startsAt) : null;
    const endDate = endedAt ? new Date(endedAt) : null;
    return (startDate && startDate < now) || endDate != null;
  });

  const upcomingCalls = calls.filter(({ state: { startsAt } }: Call) => {
    const startDate = startsAt ? new Date(startsAt) : null;
    return startDate && startDate > now;
  });

  return { endedCalls, upcomingCalls, callRecordings: calls, isLoading };
};
