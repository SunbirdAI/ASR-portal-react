import tw, { styled } from "twin.macro";

export const AuthContainer = styled.section`
  ${tw`
    w-full
    min-h-screen
    flex
    flex-col 
    items-center
    justify-center
  `}
`;

export const AuthDiv = styled.div`
  ${tw`
    w-[92%]
    sm:w-[80%]
    md:w-[60%] 
    lg:w-[40%] 
    xl:w-[32%] 
    h-auto 
    py-10 
    px-12 
    rounded-xl
    bg-white 
    border 
    border-opacity-[0.61] 
    z-30   
    my-4
  `}
`;
export const AuthHeading = styled.div`
  ${tw`
  w-full text-center h-auto
  `}
`;

export const AuthHeadingTitle = styled.h1`
  ${tw`
  text-2xl font-bold mb-1 text-sunbird-orange
  `}
`;

export const AuthHeadingSubTitle = styled.p`
  ${tw`
 text-lg font-normal mb-8
  `}
`;

export const AuthFooter = styled.div`
  ${tw`
    w-full h-auto flex items-center justify-center gap-x-1
    `}
`;

export const AuthFooterDescription = styled.p`
  ${tw`
   text-sm font-medium
    `}
`;

export const AuthFormMessage = styled.div`
  ${tw`border border-transparent w-full rounded-md flex items-center justify-center gap-3 p-4 mb-2`}
`;
export const AuthSubmitButton = styled.button`
  ${tw`
  w-full h-12 outline-none flex items-center justify-center rounded-md text-base font-semibold mb-7 border-2 border-transparent bg-sunbird-orange text-white hover:bg-opacity-90 transition-all ease-out duration-[0.3s] disabled:opacity-50       
  `}
`;
