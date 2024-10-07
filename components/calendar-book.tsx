'use client'

import { Button } from '@/components/ui/button';

export default function CalendarBook() {
	return (
		<Button
			variant="default"
			data-cal-namespace="introduction-call"
			data-cal-link="fahmisugandi/introduction-call"
			data-cal-config='{"layout":"month_view"}'
		>
			Book a meeting →
		</Button>
	);
};