import tw, { styled } from 'twin.macro';

export const Container = styled.div`
  ${tw`
    flex
    items-center
    justify-between
    p-10
    w-full
  `}
`;


export const DropZoneContainer = styled.div`
  ${tw`
    flex
    flex-1
    justify-center
    items-center
    p-6
    text-gray-700
    border-2
    border-dashed
    border-gray-300
    rounded-lg
    cursor-pointer
    transition
    duration-200
    ease-in-out
  `}
  background-color: #f9f9f9;
  &:hover {
    border-color: #a0aec0;
    background-color: #e9e9e9;
  }
  &.active {
    border-color: #000;
    background-color: #e9e9e9;
    color: #000;
  }
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

export const RecordingArea = styled.div`
  ${tw`
    flex
    flex-col
    items-center
    justify-center
  `}
`;

export const LoadingContainer = styled.div`
  ${tw`
    flex
    justify-center
    items-center
    w-full
    h-full
  `}
`;

export const VerticalDottedLine = styled.div`
  ${tw`w-0 h-full bg-transparent border-l-2 border-dotted border-gray-900 my-4 mx-4`}
`;

