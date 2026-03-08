import Image from 'next/image';

export const Logo = () => {
  return <Image src="/logo.png" alt="Herb Garden" className="object-contain h-12" width={200} height={100} quality={100} priority />;
};
