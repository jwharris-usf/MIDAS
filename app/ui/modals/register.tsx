'use client';

import { Nunito } from "next/font/google";
const nunito = Nunito({weight: ['200', '200'], subsets:['latin'], style: ['normal', 'italic']})

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

export default function RegisterModal({
  isOpen,
  onOpen,
  onOpenChange,
}:
{
  isOpen: boolean,
  onOpen: any,
  onOpenChange: any,
}) {
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch('./api/auth/register', {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        username: formData.get("username"),
        password: formData.get("password")
      }),
    });

    console.log({response});
  };

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Modal className={nunito.className} isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Register new account
            </ModalHeader>

            <ModalBody>
              <div className='flex justify-center'>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                  <Input label='Email' name='email' required={true}/>
                  <Input label='Username' name='username' required={true}/>
                  <Input 
                    label='Password' 
                    name='password' 
                    type={isVisible ? "text" : "password"}
                    required 
                    endContent={
                      <button className="focus:outline-none" type="button" onMouseDown={toggleVisibility} onMouseUp={toggleVisibility} aria-label="toggle password visibility">
                        {isVisible ? (
                          <IoIosEye className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <IoIosEyeOff className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />
                  <Button type='submit' color="success" variant="faded" onPress={onClose}>
                    Register
                  </Button>
                </form>
              </div>
              
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}