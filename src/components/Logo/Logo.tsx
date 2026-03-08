import Image from 'next/image';

export const Logo = () => {
  return <Image src="/logo.png" alt="Tiny Me" className="object-contain h-10" width={200} height={100} quality={100} priority />;
};
