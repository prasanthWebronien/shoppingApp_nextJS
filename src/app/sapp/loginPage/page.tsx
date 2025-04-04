'use client'

import axios from "axios"
import Image from "next/image"
import React, { useEffect, useState } from "react"

const LoginPage = () => {
    return (

        <div className="flex flex-col w-full h-[100dvh] bg-white relative">
            <div className="w-full h-1/2 bg-buttonColor flex justify-center pt-20" style={{ borderBottomLeftRadius: "50px", borderBottomRightRadius: "50px" }}>
                <Image src='/images/24sjuIcon.webp' alt='' width={1000} height={1000} className=" w-20 h-20" />
            </div>

            <div className="shadow-md absolute top-1/2 left-1/2 rounded-lg transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 z-10 flex flex-col items-center gap-5 w-[330px] h-[400px]">
                <h1 className="text-xl font-semibold ">Sign In</h1>
                <Image src='/images/loginUser.png' alt='login user image' width={1000} height={1000} className="h-[180px] w-[180px]" />

                <div className="flex w-full items-center justify-center w-full gap-5">
                    <input type="checkbox" className="w-5 h-5 scale-150" />
                    <span>I have read and agress to <a href="" className="text-buttonColor">Terms of Service</a> and <a href="" className="text-buttonColor">Privacy Policy</a></span>
                </div>

                <button className="bg-red-500 text-white rounded-full px-10 py-3">Sign In useing BankID</button>
            </div>

            <div className="w-full h-1/2 bg-white flex flex-col gap-5 justify-center items-center">
                <strong className="mt-32 font-xl text-black">Are you not a Swedish Citizen ?</strong>
                <button className="rounded-full text-white bg-buttonColor w-[350px] py-3 text-center text-lg">Sign In with Social Account</button>
            </div>
        </div>
    )
}

export default LoginPage;