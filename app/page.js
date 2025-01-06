import {Button} from '@/components/ui/button';
import {UserButton} from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='text-center mt-40'>
      <Link href={'/dashboard'}>
      <h2>Click the button to navigate to the dashboard</h2>
      <br/>
      <Button>Go to dashboard</Button>
        {/*<UserButton/>*/}
      </Link>
    </div>
  );
}
