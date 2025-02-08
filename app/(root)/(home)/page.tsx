'use client';

import { useMemo, useEffect, useState } from 'react';
import MeetingTypeList from '@/components/MeetingTypeList';
import { useGetCalls } from '@/hooks/useGetCalls';

const Home = () => {
  const { upcomingCalls, isLoading } = useGetCalls();
  const [nextMeetingTime, setNextMeetingTime] = useState<string | null>(null);

  const now = new Date();

  // Memoized time and date to prevent unnecessary re-renders
  const time = useMemo(() => now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), []);
  const date = useMemo(() => new Intl.DateTimeFormat('en-IN', { dateStyle: 'full' }).format(now), []);

  useEffect(() => {
    if (upcomingCalls && upcomingCalls.length > 0) {
      const nextMeeting = upcomingCalls[0]; // Get the earliest upcoming meeting
      if (nextMeeting.state?.startsAt) {
        setNextMeetingTime(
          new Date(nextMeeting.state.startsAt).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          })
        );
      }
    } else {
      setNextMeetingTime(null);
    }
  }, [upcomingCalls]);

  return (
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
            {isLoading ? 'Loading...' : nextMeetingTime ? `Upcoming Meeting at: ${nextMeetingTime}` : 'No Upcoming Meetings'}
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
