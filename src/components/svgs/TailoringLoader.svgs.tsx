const TailoringLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-pulse"
    >
      <g fill="none" stroke="#F0C38E" strokeWidth="2">
        {/* Scissors animation */}
        <g transform="translate(40, 40)">
          <path d="M-20,0 L20,0" strokeDasharray="40" strokeDashoffset="0">
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="80"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M-15,-15 L15,15" strokeDasharray="42.4" strokeDashoffset="0">
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="84.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M-15,15 L15,-15" strokeDasharray="42.4" strokeDashoffset="0">
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="84.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Needle and thread */}
        <circle
          cx="40"
          cy="40"
          r="30"
          strokeDasharray="188.5"
          strokeDashoffset="0"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="188.5"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Sewing machine needle */}
        <path d="M40,10 L40,70" strokeDasharray="60" strokeDashoffset="0">
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="120"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </svg>
  </div>
);

export default TailoringLoader;
