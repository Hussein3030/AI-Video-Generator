import {Button} from '@/components/ui/button';
import Link from 'next/link'

function EmptyState() {
  return (
      <div className='p-5 py-24 flex items-center flex-col mt-10 border-2 border-dotted'>
        <h2>You don't have any short video created</h2>
        <Link href={"/dashboard/create-new"}>
        <Button>Create new short video</Button>
        </Link>
      </div>
  );
}

 export default EmptyState