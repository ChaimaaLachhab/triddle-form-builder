import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  isPrimary?: boolean;
  ctaText?: string;
  onCtaClick?: () => void; // Added this property
}

export default function PricingCard({
  title,
  price,
  features,
  isPrimary = false,
  ctaText = "Choose Plan",
  onCtaClick // Added this parameter
}: PricingCardProps) {
  return (
    <div className={`rounded-lg ${isPrimary ? 'bg-primary text-white' : 'bg-white'} p-6 shadow-sm transition-all hover:shadow-md border ${isPrimary ? 'border-primary' : 'border-gray-200'} flex flex-col`}>
      <div className="mb-5">
        <h3 className={`text-xl font-medium ${isPrimary ? 'text-white' : ''}`}>{title}</h3>
        <div className="mt-2">
          <span className="text-2xl font-bold">{price}</span>
          {price !== "FREE" && <span className="text-sm opacity-80">/month</span>}
        </div>
      </div>
     
      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className={`mr-2 flex-shrink-0 rounded-full p-1 ${isPrimary ? 'text-white' : 'text-primary'}`}>
              <CheckIcon className="h-4 w-4" />
            </span>
            <span className={`text-sm ${isPrimary ? 'text-white/90' : 'text-gray-600'}`}>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className={isPrimary ? 'bg-white hover:bg-gray-100 text-primary' : ''}
        variant={isPrimary ? 'outline' : 'default'}
        onClick={onCtaClick} // Added onClick handler
      >
        {ctaText}
      </Button>
    </div>
  );
}