// import { useSession, signIn, signOut } from "next-auth/react";
// import Nav from "@/components/nav";
// import Logo from "@/components/Logo";
// import { useState } from "react";
// import Link from "next/link";

// export default function Layout({ children }) {
//   const [showNav, setShowNav] = useState(false);
//   const { data: session } = useSession();
//   if (!session) {
//     return (
//       <div className="bg-primary w-screen h-screen flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
//           <h1 className="text-3xl font-bold text-primary mb-6 text-center">
//             Welcome Back
//           </h1>
//           <p className="text-text mb-8 text-center">
//             Sign in to access your account
//           </p>
//           <button
//             onClick={() => signIn("google")}
//             className="btn-google w-full flex items-center justify-center gap-3 mb-4"
//           >
//             <svg className="w-5 h-5" viewBox="0 0 24 24">
//               <path
//                 fill="currentColor"
//                 d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
//               />
//             </svg>
//             Login with Google
//           </button>
//           {/* <div className="text-center text-sm text-text">
//             Don't have an account?{" "}
//             <a href="#" className="text-primary hover:underline">
//               Sign up
//             </a>
//           </div> */}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-background min-h-screen ">
//       <div className=" md:hidden flex items-center p-4">
//         <button onClick={() => setShowNav(!showNav)}>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             className="w-6 h-6 text-text hover:text-primary"
//           >
//             <path
//               fillRule="evenodd"
//               d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </button>
//         <div className="flex grow justify-center mr-6">
//           <Logo />
//         </div>
//       </div>
//       <div className="flex">
//         <Nav show={showNav} />
//         <div className=" flex-grow p-4">{children}</div>
//       </div>
//     </div>
//   );
// }

import { useSession, signIn } from "next-auth/react";
import Nav from "@/components/nav";
import Logo from "@/components/Logo";
import { useState } from "react";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="bg-primary w-screen h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center">
            Welcome Back
          </h1>
          <p className="text-text mb-8 text-center">
            Sign in to access your account
          </p>
          <button
            onClick={() => signIn("google")}
            className="btn-google w-full flex items-center justify-center gap-3 mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col md:flex-row">
      <div className="md:hidden flex items-center p-4 bg-background sticky top-0 z-30">
        <button onClick={() => setShowNav(!showNav)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-text hover:text-primary"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <Nav show={showNav} onClose={() => setShowNav(false)} />
      <div className="flex-grow p-4 md:overflow-y-auto md:h-screen">
        {children}
      </div>
      {showNav && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setShowNav(false)}
        />
      )}
    </div>
  );
}
