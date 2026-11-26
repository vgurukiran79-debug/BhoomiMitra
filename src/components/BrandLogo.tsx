interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = 'w-9 h-9' }: BrandLogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-[#236B45] text-white shrink-0 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
      >
        <path
          d="M14 23V12.5"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <path
          d="M14 14.5C14 9.5 17.5 6 22.5 6C22.5 11 19 14.5 14 14.5Z"
          fill="#73A942"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M14 16.5C14 12 10.8 8.8 6 8.8C6 13.5 9.2 16.5 14 16.5Z"
          fill="currentColor"
          fillOpacity="0.22"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 23H19.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
