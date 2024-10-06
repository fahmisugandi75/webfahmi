import Hero from "@/components/hero";
import FeatureSection from "@/components/feature-section";

export default function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Hero />
      <FeatureSection />
      {/* Add other sections or components here */}
    </div>
  );
}
