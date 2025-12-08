interface SubscriptionCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  badge: string | null;
  features: string[];
  buttonText: string;
  buttonStyle: "primary" | "secondary";
  isHighlighted: boolean;
  previousFeatures: string | null;
  onClick: () => void;
}

export default function SubscriptionCard({
  name,
  price,
  originalPrice,
  description,
  badge,
  features,
  buttonText,
  buttonStyle,
  isHighlighted,
  previousFeatures,
  onClick,
}: SubscriptionCardProps) {
  return (
    <div
      className={`bg-white border-2 rounded-lg p-6 ${
        isHighlighted ? "border-[#d4af37] shadow-lg" : "border-stone-200"
      }`}
    >
      {badge && (
        <div
          className={`text-xs font-medium px-3 py-1 rounded-full mb-4 inline-block ${
            isHighlighted ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {badge}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-2 text-[#393634]">{name}</h2>
      <p className="text-gray-600 mb-4">{description}</p>

      <div className="mb-2">
        <span className="text-3xl font-bold text-[#393634]">₹{price}</span>
        {originalPrice && (
          <span className="text-sm text-gray-500 ml-2 line-through">₹{originalPrice}</span>
        )}
      </div>
      <p className={`text-sm text-gray-500 mb-4 ${previousFeatures ? "" : "mb-6"}`}>per month</p>
      {previousFeatures && (
        <p className="text-sm text-gray-600 mb-4">{previousFeatures}</p>
      )}

      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
            <svg
              className="w-5 h-5 text-green-500 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onClick}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          buttonStyle === "primary"
            ? "bg-[#393634] text-white hover:bg-[#2a2725]"
            : "bg-stone-100 text-[#393634] hover:bg-stone-200"
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}

