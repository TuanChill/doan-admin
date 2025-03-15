import { blob, grid } from '@/components/image';
import Image from 'next/image';

export const Background = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#040404]">
      <Image
        src={blob}
        alt="background"
        fill
        className="absolute !left-[357px] !top-[300px] z-[1] scale-110"
      />
      <Image
        src={grid}
        alt="background"
        fill
        className="absolute z-0 opacity-20"
      />
    </div>
  );
};
