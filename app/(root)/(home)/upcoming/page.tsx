'use client';

import { useEffect, useState } from 'react';
import CallList from '@/components/CallList';
import { useGetCalls } from '@/hooks/useGetCalls';

const UpcomingPage = () => {
  const { upcomingCalls, isLoading } = useGetCalls();
  const [nextMeetingTime, setNextMeetingTime] = useState<string | null>(null);

  useEffect(() => {
    if (upcomingCalls && upcomingCalls.length > 0) {
      const nextMeeting = upcomingCalls[0]; // Get the first scheduled meeting
      if (nextMeeting.state?.startsAt) {
        setNextMeetingTime(new Date(nextMeeting.state.startsAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      }
    } else {
      setNextMeetingTime(null);
    }
  }, [upcomingCalls]);

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold" aria-live="polite">
        Upcoming Meetings
      </h1>

      {isLoading ? (
        <p className="text-xl text-gray-300">Loading meetings...</p>
      ) : nextMeetingTime ? (
        <p className="text-xl font-medium text-green-400">
          Next meeting at: {nextMeetingTime}
        </p>
      ) : (
        <p className="text-xl text-red-400">No Upcoming Meetings</p>
      )}

      <CallList type="upcoming" />
    </section>
  );
};

export default UpcomingPage;
