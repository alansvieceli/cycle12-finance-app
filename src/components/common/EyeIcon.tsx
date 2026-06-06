import Svg, { Path } from 'react-native-svg';

type EyeIconProps = {
  color: string;
  hidden: boolean;
};

export function EyeIcon({ color, hidden }: EyeIconProps) {
  if (hidden) {
    return (
      <Svg fill="none" height={44} viewBox="0 0 35 35" width={44}>
        <Path
          d="M8.0476 17.514C10.0386 19.922 13.3026 22.5 17.9996 22.5C22.6966 22.5 25.9606 19.922 27.9516 17.514"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
        <Path
          d="M13.5 21.5L12 24.5"
          stroke={color}
          strokeLinecap="round"
          strokeWidth={1.5}
        />
        <Path
          d="M18 22.5V25.5"
          stroke={color}
          strokeLinecap="round"
          strokeWidth={1.5}
        />
        <Path
          d="M22.5 21.5L24 24.5"
          stroke={color}
          strokeLinecap="round"
          strokeWidth={1.5}
        />
      </Svg>
    );
  }

  return (
    <Svg fill="none" height={44} viewBox="0 0 35 35" width={44}>
      <Path
        d="M8.0476 18.486C8.1416 18.846 8.27759 19.033 8.54959 19.406C10.0386 21.45 13.3026 25 17.9996 25C22.6966 25 25.9606 21.45 27.4496 19.405C27.7216 19.033 27.8576 18.846 27.9516 18.485C28.0151 18.1644 28.0151 17.8346 27.9516 17.514C27.8576 17.154 27.7216 16.967 27.4496 16.594C25.9606 14.55 22.6966 11 17.9996 11C13.3026 11 10.0386 14.55 8.54959 16.595C8.27759 16.967 8.1416 17.154 8.0476 17.515C7.98413 17.8356 7.98413 18.1654 8.0476 18.486Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <Path
        d="M17.9996 20C18.5301 20 19.0388 19.7893 19.4138 19.4142C19.7889 19.0391 19.9996 18.5304 19.9996 18C19.9996 17.4696 19.7889 16.9609 19.4138 16.5858C19.0388 16.2107 18.5301 16 17.9996 16C17.4692 16 16.9605 16.2107 16.5854 16.5858C16.2103 16.9609 15.9996 17.4696 15.9996 18C15.9996 18.5304 16.2103 19.0391 16.5854 19.4142C16.9605 19.7893 17.4692 20 17.9996 20Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
