import { BiLogoGmail } from "react-icons/bi";
import { FaChevronUp, FaLinkedinIn } from "react-icons/fa6";
import { TiSocialGithub } from "react-icons/ti";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div
      className="relative w-full h-[30vh]"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
      }}
    >
      <footer className="footer h-[30vh] sm:footer-horizontal bg-base-100 text-base-content items-center justify-center p-4 fixed bottom-0">
        <div className="bottom flex flex-col justify-center items-center gap-2 ">
          <div id="socials" className="flex gap-4">
            <a
              href="mailto:enechithony@gmail.com"
              target="_blank"
              className="bg-[#909090]  p-2 rounded-full flex justify-center items-center"
            >
              <BiLogoGmail className="text-black h-7 w-7" />
            </a>
            <a
              href="https://github.com/tnenechi"
              target="_blank"
              className="bg-[#909090] shadow-2xl p-2 rounded-full flex justify-center items-center"
            >
              <TiSocialGithub className="text-black h-7 w-7" />
            </a>
            <a
              href="https://www.linkedin.com/in/thony-enechi/"
              target="_blank"
              className="bg-[#909090] shadow-2xl p-2 rounded-full flex justify-center items-center"
            >
              <FaLinkedinIn className="text-black h-7 w-7" />
            </a>
          </div>
          <p className="">
            Thony&copy; {new Date().getFullYear()} - All right reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
