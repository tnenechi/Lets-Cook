import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import RecipeModal from "../components/RecipeModal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const RecipeList = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const topCarousels = gsap.utils.toArray<HTMLElement>(
      ".top > .carousel-item"
    );
    const bottomCarousels = gsap.utils.toArray<HTMLElement>(
      ".bottom > .carousel-item"
    );

    topCarousels.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        gsap.to(el, { scale: 0.95, duration: 0.2 });
      });

      el.addEventListener("mouseleave", () => {
        gsap.to(el, { scale: 1, duration: 0.2 });
      });

      el.addEventListener("click", () => {
        setOpen(true);
      });
    });

    gsap.set(bottomCarousels, { opacity: 0.5 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: containerRef.current,
        end: () => "+=" + containerRef.current?.offsetWidth,
        pin: true,
        scrub: 1,
      },
    });

    tl.fromTo(
      topCarousels,
      { xPercent: 100, ease: "none" },
      {
        xPercent: -100 * (topCarousels.length - 1),
        ease: "none",
      }
    );

    tl.fromTo(
      bottomCarousels,
      { xPercent: -100 * (bottomCarousels.length - 1), ease: "none" },
      {
        xPercent: 100 * (bottomCarousels.length - 1),
        ease: "none",
      },
      "<"
    );

    tl.eventCallback("onUpdate", () => {
      bottomCarousels.forEach((bCarousel) => {
        const matchingTop = document.getElementById(
          bCarousel.dataset.match as string
        )!;

        const bottomRect = bCarousel.getBoundingClientRect();
        const topRect = matchingTop.getBoundingClientRect();

        if (
          bottomRect.right >= topRect.left &&
          bottomRect.left <= topRect.right
        ) {
          gsap.to(bCarousel, { opacity: 1 });
        } else {
          gsap.to(bCarousel, { opacity: 0.5 });
        }
      });
    });
  });

  return (
    <>
      <div
        ref={containerRef}
        className="flex flex-col gap-4 h-screen bg-neutral py-4"
      >
        <div className="top carousel carousel-center  rounded-box space-x-4 ">
          <div id="1" className="carousel-item w-70 h-50">
            <img
              src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp"
              className="rounded-box w-full h-full object-cover"
            />
          </div>
          <div id="2" className="carousel-item w-70 h-50">
            <img
              src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp"
              className="rounded-box w-full h-full object-cover"
            />
          </div>
          <div id="3" className="carousel-item w-70 h-50">
            <img
              src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp"
              className="rounded-box w-full h-full object-cover"
            />
          </div>
          <div id="4" className="carousel-item w-70 h-50">
            <img
              src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp"
              className="rounded-box w-full h-full object-cover"
            />
          </div>
          <div id="5" className="carousel-item w-70 h-50">
            <img
              src="https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp"
              className="rounded-box w-full h-full object-cover"
            />
          </div>
          <div id="6" className="carousel-item w-70 h-50">
            <img
              src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp"
              className="rounded-box w-full h-full object-cover"
            />
          </div>
          <div id="7" className="carousel-item w-70 h-50">
            <img
              src="https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp"
              className="rounded-box w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="bottom carousel carousel-center rounded-box  space-x-4 ">
          <div
            data-match="7"
            className="carousel-item bg-amber-400 w-70 h-50 flex flex-col justify-center items-center rounded-box"
          >
            <p>Apple Or Peach Strudel</p>
            <p>Preparation: 20 minutes</p>
            <p>Cooking time: 25 minutes</p>
            <p>Total time: 45 minutes</p>
          </div>
          <div
            data-match="6"
            className="carousel-item bg-teal-400 w-70 h-50 flex flex-col justify-center items-center rounded-box"
          >
            <p>Apple Or Peach Strudel</p>
            <p>Preparation: 20 minutes</p>
            <p>Cooking time: 25 minutes</p>
            <p>Total time: 45 minutes</p>
          </div>
          <div
            data-match="5"
            className="carousel-item bg-purple-400 w-70 h-50 flex flex-col justify-center items-center rounded-box"
          >
            <p>Apple Or Peach Strudel</p>
            <p>Preparation: 20 minutes</p>
            <p>Cooking time: 25 minutes</p>
            <p>Total time: 45 minutes</p>
          </div>
          <div
            data-match="4"
            className="carousel-item bg-blue-600 w-70 h-50 flex flex-col justify-center items-center rounded-box"
          >
            <p>Apple Or Peach Strudel</p>
            <p>Preparation: 20 minutes</p>
            <p>Cooking time: 25 minutes</p>
            <p>Total time: 45 minutes</p>
          </div>
          <div
            data-match="3"
            className="carousel-item bg-yellow-400 w-70 h-50 flex flex-col justify-center items-center rounded-box"
          >
            <p>Apple Or Peach Strudel</p>
            <p>Preparation: 20 minutes</p>
            <p>Cooking time: 25 minutes</p>
            <p>Total time: 45 minutes</p>
          </div>
          <div
            data-match="2"
            className="carousel-item bg-pink-400 w-70 h-50 flex flex-col justify-center items-center rounded-box"
          >
            <p>Apple Or Peach Strudel</p>
            <p>Preparation: 20 minutes</p>
            <p>Cooking time: 25 minutes</p>
            <p>Total time: 45 minutes</p>
          </div>
          <div
            data-match="1"
            className="carousel-item bg-blue-400 w-70 h-50 flex flex-col justify-center items-center rounded-box"
          >
            <p>Apple Or Peach Strudel</p>
            <p>Preparation: 20 minutes</p>
            <p>Cooking time: 25 minutes</p>
            <p>Total time: 45 minutes</p>
          </div>
        </div>
      </div>

      <RecipeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default RecipeList;
