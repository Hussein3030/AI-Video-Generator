'use client';
import {useContext, useEffect, useState} from 'react';
import {PayPalButtons, PayPalScriptProvider} from '@paypal/react-paypal-js';
import {db} from '@/configs/db';
import {Users} from '@/configs/schema';
import {UserDetailContext} from '@/app/_context/UserDetailContext';
import {eq} from 'drizzle-orm';
import {useRouter} from 'next/navigation';
import {useUser} from '@clerk/nextjs';
import {toast} from 'sonner';

function BuyCredits() {

  const Options = [
    {
      id: 1,
      price: 1.99,
      credits: 30,
      videos: 3,
    },
    {
      id: 2,
      price: 2.99,
      credits: 50,
      videos: 5,
    },
    {
      id: 3,
      price: 3.99,
      credits: 70,
      videos: 7,
    },
    {
      id: 4,
      price: 5.99,
      credits: 120,
      videos: 12,
    },

  ];

  const [selectedPrice,setSelectedPrice]=useState(0);
  const [selectOption, setSelectOption] = useState(0);
  const {userDetail,setUserDetail}=useContext(UserDetailContext)
  const {user}=useUser();
  const router=useRouter();

  useEffect(()=>{
    console.log('99: ' + userDetail?.credits)
    if(selectOption!=0){
      const price = Options[selectOption-1].price;
      console.log("MM:"+ price)
      setSelectedPrice(price)
    }
  },[selectOption])


  const OnPaymentSuccess=async ()=>{
    const result=await db.update(Users).set({
      credits:Options[selectOption]?.credits+userDetail?.credits
    }).where(eq(Users?.email,userDetail.email))
    if(result){
      toast("Credit is added successfully")
      setUserDetail((prev)=>({
        ...prev,
        ['credits']:Options[selectOption]?.credits+userDetail?.credits
      }))
      router.replace('/dashboard')
    }else {
      toast('Error')
    }

  }


  return (
      <div className="min-h-screen p-10 md:px:20 lg:px-40 text-center">
        <h2 className="text-4xl font-bold text-primary">Add more credits</h2>
        <div
            className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-10 items-center justify-center">
          <div>
            {Options.map((option, index) => (
                <div className={`p-6 my-3 border bg-primary text-center rounded-lg text-white 
                cursor-pointer hover:scale-105 transition-all
                 ${selectOption == option.id ? 'bg-blue-500' : 'initial'}
                `}
                     onClick={() => {
                       setSelectOption(option.id);
                       console.log('ÖÖ:'+setSelectOption(option.id))
                     }}>
                  <h2>Get {option.credits} Credits= {option.videos} Videos</h2>
                  <h2 className="font-bold text-2xl">€{option.price}</h2>
                </div>
            ))}
          </div>
          <div>
            <PayPalScriptProvider
                options={{clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}}>
              {selectedPrice>0&& <PayPalButtons style={{layout: 'vertical'}}
                             disabled={!selectOption||selectOption==0}
                             onApprove={()=>OnPaymentSuccess()}
                             onCancel={()=>toast("Payment canceled")}
                             createOrder={(data, actions) => {
                               return actions.order.create({
                                 purchase_units: [
                                   {
                                     amount: {
                                       value: selectedPrice.toFixed(2),
                                       currency_code:'USD'
                                     },
                                   },
                                 ],
                               });
                             }}
              />}
            </PayPalScriptProvider>
          </div>
        </div>
      </div>
  );
}

export default BuyCredits;