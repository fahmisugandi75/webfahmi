'use client'

import { getCalApi } from "@calcom/embed-react";
import { Button } from "@headlessui/react";
import { useEffect } from "react";

export default function CalendarBook() {
	useEffect(()=>{
	  (async function () {
		const cal = await getCalApi({"namespace":"introduction-call"});
		cal("ui", {"styles":{"branding":{"brandColor":"#000000"}},"hideEventTypeDetails":false,"layout":"month_view"});
	  })();
	}, [])
	return <Button data-cal-namespace="introduction-call"
	  data-cal-link="fahmisugandi/introduction-call"
    
	  data-cal-config='{"layout":"month_view"}'
	  >Book a meeting →</Button>;
  };