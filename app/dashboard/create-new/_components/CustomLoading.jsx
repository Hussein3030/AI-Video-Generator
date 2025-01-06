import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from "next/image"


function CustomLoading({loading}) {
  return (
      <AlertDialog open={loading}>
        <AlertDialogContent>
          <div className='flex flex-col items-center my-10 justify-center'>
          <Image src={'/loading.gif'} width={100} height={100} alt={'Loading'}/>
          <div>Generating your video...  please do not refresh</div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

  );
}

export default CustomLoading