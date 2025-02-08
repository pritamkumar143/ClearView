'use client';

import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import Loader from './Loader';
import MeetingCard from './MeetingCard';
import { useGetCalls } from '@/hooks/useGetCalls';

interface CallListProps {
  type: 'ended' | 'upcoming' | 'recordings';
}

const CallList = ({ type }: CallListProps) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      if (type !== 'recordings') return;

      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
      );

      const fetchedRecordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(fetchedRecordings);
    };

    fetchRecordings();
  }, [type, callRecordings]);

  // Memoizing call lists to avoid unnecessary recalculations
  const calls = useMemo(() => {
    return type === 'ended'
      ? endedCalls
      : type === 'upcoming'
        ? upcomingCalls
        : recordings;
  }, [type, endedCalls, upcomingCalls, recordings]);

  const noCallsMessage = useMemo(() => {
    return type === 'ended'
      ? 'No Previous Calls'
      : type === 'upcoming'
        ? 'No Upcoming Calls'
        : 'No Recordings';
  }, [type]);

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls?.length > 0 ? (
        calls.map((meeting) => {
          const isCallRecording = (meeting as CallRecording).url !== undefined;

          return (
            <MeetingCard
              key={(meeting as Call).id}
              icon={
                type === 'ended'
                  ? '/icons/previous.svg'
                  : type === 'upcoming'
                    ? '/icons/upcoming.svg'
                    : '/icons/recordings.svg'
              }
              title={
                (meeting as Call).state?.custom?.description ||
                (meeting as CallRecording).filename?.substring(0, 20) ||
                'No Description'
              }
              date={
                (meeting as Call).state?.startsAt?.toLocaleString() ||
                (meeting as CallRecording).start_time?.toLocaleString()
              }
              isPreviousMeeting={type === 'ended'}
              link={
                isCallRecording
                  ? (meeting as CallRecording).url
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
              }
              buttonIcon1={isCallRecording ? '/icons/play.svg' : undefined}
              buttonText={isCallRecording ? 'Play' : 'Start'}
              handleClick={() =>
                router.push(
                  isCallRecording
                    ? (meeting as CallRecording).url
                    : `/meeting/${(meeting as Call).id}`
                )
              }
            />
          );
        })
      ) : (
        <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
