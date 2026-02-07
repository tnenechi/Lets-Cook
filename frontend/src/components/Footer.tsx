import { BiLogoGmail } from "react-icons/bi";
import { FaLinkedinIn } from "react-icons/fa6";
import { TiSocialGithub } from "react-icons/ti";

const Footer = () => {
  return (
    <div
      className="relative w-full h-[30vh]"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
      }}
    >
      <footer className="footer h-[30vh] sm:footer-horizontal bg-base-100 text-base-content items-center justify-center p-4 fixed bottom-0">
        <div className="bottom flex flex-col justify-center items-center gap-2 ">
          <p>
            &copy; {new Date().getFullYear()} Let's Cook - Designed & Developed
            by{" "}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-info transition-transform duration-200 hover:scale-95"
            >
              Thony.
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
