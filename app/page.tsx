import React from "react";
import { getData } from '@/app/actions/actions'
import HomeClientComponent from "@/app/Home";

export const dynamic = 'force-dynamic';

export default async function Home() {
	
 	const data = await getData()
	return <HomeClientComponent data={data}/>
}