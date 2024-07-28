import tw, { styled } from "twin.macro";

export const MainContainer = styled.div`
  ${tw`
    flex
    flex-col
    w-full
    gap-4
    rounded-md
    p-4
    relative
  `}
  @media (min-width: 768px) {
    ${tw`flex-row`}
  }
  font-size: 16px; // Base font size
  @media (max-width: 768px) {
    font-size: 14px; // Smaller font size for tablets
  }
  @media (max-width: 480px) {
    font-size: 12px; // Even smaller font size for mobile phones
  }
`;

export const LanguageDropdown = styled.select`
  ${tw`
    w-full
    px-4
    py-2
    mx-auto
    my-2
    border
    border-gray-300
    rounded-lg
    bg-white
    text-gray-700
    transition
    duration-200
    ease-in-out
    outline-none
    focus:border-blue-600
    focus:ring-2
    focus:ring-blue-500
    focus:ring-opacity-50
  `}
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  max-width: 250px; // Ensures dropdown doesn't get too wide on larger screens
`;

export const ResponsiveContainer = styled.div`
  ${tw`flex flex-col items-center justify-center w-full p-4 bg-white shadow-md rounded-lg`}
  h3 {
    ${tw`text-center w-full`} // Ensures that the heading is always centered
  }
  @media (min-width: 768px) {
    ${tw`flex-col justify-start items-start p-6`}
  }
`;

export const ButtonContainer = styled.div`
  ${tw`mt-4 w-full flex justify-center`}
`;

export const AudioPlayerContainer = styled.div`
  ${tw`w-full my-4`}
`;

export const DynamicMainContainer = styled(MainContainer)`
  padding-bottom: ${props => props.hasFooter ? '100px' : '0'};
`;

export const Note = styled.div`
  ${tw`
    flex
    p-1
    w-full
    items-center
    bg-gray-100 shadow
    text-gray-700
    rounded-md
    mb-4
    justify-between
    relative
  `}
`;

export const CloseButton = styled.button`
  ${tw`
    absolute
    top-2
    right-2
    bg-transparent
    border-none
    text-yellow-800
    cursor-pointer
    text-lg
  `}
`;
