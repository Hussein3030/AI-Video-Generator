import Image from 'next/image'
import {Button} from '@/components/ui/button';
import {UserButton} from '@clerk/nextjs';
import {useContext} from 'react';
import {UserDetailContext} from '@/app/_context/UserDetailContext';
import Link from 'next/link';

function Header() {

  const {userDetail,setUserDetail}=useContext(UserDetailContext)

  return (
      <div className='p-3 px-5 flex items-center justify-between shadow-md'>
        <div className='flex gap-3 items-center'>
          <Image src={'logo.svg'} width={50} height={50}  alt={'logo'}/>
          <h2 className='font-bold text-xl'>Ai Short video</h2>
        </div>
        <div className='flex gap-3 items-center'>
         <div className='flex gap-1 items-center'>
           <Image src={'/coin.png'} width={20} height={20} alt={'coin'}/>
           <h2>{userDetail?.credits}</h2>
         </div>
          <Link href={'/dashboard/buy-credits'}>
          <Button>Buy more credits</Button>
          </Link>
          {/*<Button>Dashboard</Button>*/}
          <UserButton/>

        </div>
      </div>
  );
}

 export default Header