import Image from 'next/image';
import { Button } from '@/components/ui/cta-button';  // Updated import path

export default function Header() {
  return (
    <section className="w-full px-4 py-16">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Website management done for you</h1>
        <p className="text-xl text-gray-600 mb-8">
          I am Fahmi, digital-savvy expert specializing in WordPress development, SEO, email automation, and marketing design. I align digital strategies with your business goals to drive real results. Ready to take your online presence to the next level? Let's connect!
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="default">
            <a href="#">Schedule a call</a>
          </Button>
          <Button variant="secondary">
            <a href="#">See plans</a>
          </Button>
        </div>
        <div className="mt-16 flex justify-center">
          <Image 
            src="https://yfxskljlopmcwmghykcl.supabase.co/storage/v1/object/sign/Images/Group%2088.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvR3JvdXAgODguanBnIiwiaWF0IjoxNzI4MDI3MTY4LCJleHAiOjQ4NTAwOTExNjh9.stPudGvGPC9kdi8uvmBdXkPqZ7lMRxU9N7_gkjqfkWY&t=2024-10-04T07%3A32%3A48.710Z"
            width={900}  // Replace with actual width
            height={500}  // Replace with actual height
            alt="Description of the image"
            className="mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
