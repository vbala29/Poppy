import { ImageResponse } from 'next/og';
import { IoIosRose } from 'react-icons/io';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: 'black', // Set background color if needed
          borderRadius: '50%',
        }}
        className="z-50"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '4px solid black', // Border color and width
            boxSizing: 'border-box',
          }}
        >
          <IoIosRose size={30} color="white" />
        </div>
      </div>
    ),
    {
      // For convenience, we can re-use the exported icon's size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}