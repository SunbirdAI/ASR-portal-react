import tw, { styled } from "twin.macro";

export const Nav = styled.div`
  ${tw`
    flex
    fixed
    inset-x-0
    bottom-0
    items-center
    justify-center
    p-4
    bg-gray-800
    text-white
    z-50
  `}
`;

export const AudioPlayerContainer = styled.div`
  ${tw`w-full max-w-md mx-auto my-2`}
`;

export const FooterContainer = styled.footer`
  ${tw`
    fixed
    inset-x-0
    bottom-0
    z-10
  `}
  background: #fff; // Or any color to match your design
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
`;

export const ButtonContainer = styled.div`
  ${tw`absolute right-4 bottom-4`}
  @media (max-width: 60px) {
    ${tw`relative mt-4`}
  }
`;

export const EditButtonContainer = styled.div`
  ${tw`absolute right-40 max-sm:right-20 bottom-4`}
  @media (max-width: 60px) {
    ${tw`relative mt-4`}
  }
`;

export const TextNav = styled.p`
  ${tw`hidden md:flex`}
  font-size: 16px; // Base font size for larger screens

  @media (min-width: 768px) {
    display: block; // Show text on screens larger than 768px
    ${tw`flex-row`}
  }

  @media (max-width: 768px) {
    display: none; // Hide text on screens smaller than or equal to 768px
    font-size: 14px; // Smaller font size for tablets (optional if hidden)
  }

  @media (max-width: 480px) {
    display: none; // Ensure text remains hidden on very small devices
    font-size: 12px; // Even smaller font size (optional if hidden)
  }
`;


