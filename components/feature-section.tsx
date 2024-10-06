import React from 'react';

interface Feature {
  title: string;
  icon: string;
  description: string;
}

const features: Feature[] = [
  {
    title: "Struggling to keep your website up-to-date?",
    icon: "📅",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    title: "Unhappy with your current conversion rate?",
    icon: "📊",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    title: "No budget for an in-house expert?",
    icon: "💰",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
];

const FeatureSection: React.FC = () => {
  return (
    <section className="bg-gray-100 py-16 w-full">
      <div className="px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">You've found me, which means you are...</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;