import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useApiAxios from '../config/axios';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const handelEmailChange = (event) => {
        setEmail(event.target.value);
    }
   
    const handleForgetPassword = (event) => {
        // Check if email is not null
        if (!email) {
          alert("Email is required");
          return;
        }
        useApiAxios
          .post("auth/forgetpassword", { email })
          .then((response) => {
            console.log(response.data.message);
            alert(response.data.message);
          })
          .catch((error) => {
            console.error(error);
          });
      }
  

   

    return (
        <>
         
            {/* form section */}
            <section className="relative">
                <div className="container py-100px">
                    <div className="md:w-2/3 mx-auto">
                        {/* form container */}
                        <div className="shadow-container bg-whiteColor dark:bg-whiteColor-dark pt-10px px-5 pb-10 md:p-50px md:pt-30px rounded-5px">
                            {/* new password form */}
                            <div className="block opacity-100 transition-opacity duration-150 ease-linear">
                                {/* heading */}
                                <div className="text-center">
                                    <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
                                        Email
                                    </h3>
                                </div>
                                <form className="pt-25px" data-aos="fade-up" onSubmit={handleForgetPassword}>
                                    <div className="grid grid-cols-1 lg:grid-cols-1 lg:gap-x-30px gap-y-25px mb-25px">
                                        <div>
                                            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                                                Email
                                            </label>
                                            <input
                                                type="password"
                                            
                                                onChange={handelEmailChange}
                                                placeholder="New Password"
                                                className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-25px text-center">
                                        <button
                                            type="submit"
                                            className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                                        >
                                            submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ForgetPassword;
