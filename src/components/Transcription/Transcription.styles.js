import tw, { styled } from "twin.macro";
import { Button } from "@mui/material"; // Import Button here

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
  font-size: 16px;
  @media (max-width: 768px) {
    font-size: 14px;
  }
  @media (max-width: 480px) {
    font-size: 12px;
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
  max-width: 250px;
`;

export const ResponsiveContainer = styled.div`
  ${tw`flex flex-col items-center justify-center w-full p-4 bg-white shadow-md rounded-lg`}
  h3 {
    ${tw`text-center w-full`}
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

// New styles for the feedback section
export const FeedbackContainer = styled.div`
  ${tw`
    w-full
    flex
    flex-col
    items-center
    p-4
    mt-4
    bg-gray-100
    rounded-md
    shadow-md
  `}
`;

export const RatingStars = styled.div`
  ${tw`
    flex
    justify-center
    mb-2
  `}
  span {
    ${tw`
      text-2xl
      cursor-pointer
      transition
      duration-200
      ease-in-out
    `}
  }
`;

export const FeedbackTextarea = styled.textarea`
  ${tw`
    w-full
    p-2
    mt-2
    border
    border-gray-300
    rounded-md
    outline-none
    resize-none
  `}
  height: 100px;
  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
  }
`;

export const SubmitFeedbackButton = styled(Button)`
  ${tw`
    mt-4
  `}
`;
