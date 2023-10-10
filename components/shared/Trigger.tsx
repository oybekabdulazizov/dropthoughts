'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

type Props = {
  limit: number;
  hasNext: boolean;
  route: string;
};

export default function Trigger({ limit, hasNext, route }: Props) {
  const router = useRouter();
  const TriggerRef = useCallback(
    (node: any) => {
      if (!node) return;

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNext) {
            router.push(`${route + '/'}?limit=${limit + 5}`, { scroll: false });
            observer.disconnect();
          }
        });
      });

      observer.observe(node);
    },
    [limit]
  );

  if (hasNext) {
    return (
      <div ref={TriggerRef} className='text-light-2 text-center mt-2'>
        Loading more...
      </div>
    );
  } else {
    return (
      <div ref={TriggerRef} className='no-result text-center mt-2'>
        That's all for now!
      </div>
    );
  }
}
