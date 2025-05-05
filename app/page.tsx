/* eslint-disable @next/next/no-img-element */
// src/app/page.js (หรือ components/ScrollExamples.js)
"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SvgScrollAnimation from "@/components/gsap/SvgScrollAnimation";
import TextRevealScroll from "@/components/gsap/TextRevealScroll";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);

  // Refs from previous examples (Sections 1-5)
  const simpleTriggerRef = useRef(null);
  const scrubRef = useRef(null);
  const pinSectionRef = useRef(null);
  const pinContentRef = useRef(null);
  const batchContainerRef = useRef(null);
  const responsiveRef = useRef(null);

  // --- Refs for Section 6: Reversed Side Pinning ---
  const reversedPinSectionRef = useRef(null); // Main container for the section
  const scrollingImageContainerRef = useRef<HTMLDivElement>(null); // Container for SCROLLING images on the left
  const pinnedStepsContainerRef = useRef(null); // Container for PINNED steps on the right
  // Refs for individual step text elements (will be pinned)
  const step1TextRef = useRef(null);
  const step2TextRef = useRef(null);
  const step3TextRef = useRef(null);
  // Refs for individual images (will scroll and trigger text changes)
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const image3Ref = useRef(null);
  // ---------------------------------------------------

  useGSAP(
    () => {
      // --- Previous Examples (1-5) ---
      // (ใส่โค้ด GSAP ของ section 1-5 ที่นี่)
      // Example: Simple Trigger
      gsap.from(simpleTriggerRef.current, {
        opacity: 0,
        x: -150,
        duration: 1,
        scrollTrigger: {
          trigger: simpleTriggerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
          markers: { fontSize: "0.8rem", startColor: "cyan", endColor: "pink" },
          id: "simple-trigger",
        },
      });
      // Example: Scrub
      gsap.to(scrubRef.current, {
        rotation: 360,
        scale: 1.5,
        ease: "none",
        scrollTrigger: {
          trigger: scrubRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
          markers: { startColor: "green", endColor: "red" },
          id: "scrub-anim",
        },
      });
      // Example: Pinning
      const pinTrigger = ScrollTrigger.create({
        trigger: pinSectionRef.current,
        pin: true,
        start: "top top",
        end: "+=500",
        markers: { startColor: "orange", endColor: "purple" },
        id: "pin-section",
      });
      gsap.to(pinContentRef.current, {
        scale: 1.2,
        opacity: 0.5,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: pinSectionRef.current,
          start: "top top",
          end: pinTrigger.end,
          scrub: 0.5,
          id: "pin-content-anim",
        },
      });
      // Example: Batch
      const items = gsap.utils.toArray(".batch-item") as Element[];
      gsap.set(items, { opacity: 0, y: 50 });
      ScrollTrigger.batch(items, {
        start: "top 90%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: "power2.out",
            overwrite: true,
          }),
        onLeaveBack: (batch) =>
          gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
      });
      // Example: Responsive
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": function () {
          gsap.to(responsiveRef.current, {
            x: 200,
            rotation: 0,
            backgroundColor: "lightblue",
            scrollTrigger: {
              trigger: responsiveRef.current,
              start: "top center",
              end: "+=300",
              scrub: true,
              markers: { startColor: "navy", endColor: "darkblue" },
              id: "responsive-desktop",
            },
          });
        },
        "(max-width: 767px)": function () {
          gsap.to(responsiveRef.current, {
            x: 0,
            rotation: 90,
            backgroundColor: "lightcoral",
            scrollTrigger: {
              trigger: responsiveRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
              markers: { startColor: "red", endColor: "darkred" },
              id: "responsive-mobile",
            },
          });
        },
      });

      // --- Section 6: Reversed Side Pinning Logic ---

      // 1. Pin the Right Text Steps Container
      ScrollTrigger.create({
        trigger: reversedPinSectionRef.current, // Use the main section container as trigger
        pin: pinnedStepsContainerRef.current, // <<< Pin the TEXT container on the right
        start: "top top",
        // End when the bottom of the SCROLLING IMAGE container reaches the bottom of the viewport
        end: () =>
          scrollingImageContainerRef.current
            ? `+=${
                scrollingImageContainerRef.current.offsetHeight -
                window.innerHeight
              }`
            : "+=0", // <<< Depends on LEFT column height now
        markers: { startColor: "blue", endColor: "navy", fontSize: "0.8rem" },
        id: "pin-steps-section",
        invalidateOnRefresh: true, // Recalculate end on resize
      });

      // 2. Handle Text Color Change Triggered by Images
      const stepsAndImages = [
        { text: step1TextRef, image: image1Ref },
        { text: step2TextRef, image: image2Ref },
        { text: step3TextRef, image: image3Ref },
      ];

      stepsAndImages.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item.image.current, // <<< Trigger is now the IMAGE element
          start: "top center", // Activate when image top hits viewport center
          end: "bottom center", // Deactivate when image bottom leaves viewport center
          // markers: true, // Enable markers for debugging this specific trigger
          markers: {
            startColor: "lime",
            endColor: "darkgreen",
            fontSize: "0.7rem",
            indent: 100,
          },
          toggleClass: {
            targets: item.text.current, // <<< Target the corresponding TEXT element
            className: "active-step-text", // Add/remove the class for red color
          },
          id: `image-${index + 1}-triggers-text`,
          // containerAnimation: pinTrigger, // Might be needed if pin creates separate scroll context, test this
        });
      });

      // No separate image timeline needed now, images scroll naturally.

      // --- End of Section 6 Logic ---
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="overflow-x-hidden font-sans">
      {/* --- Header and Sections 1-5 (JSX Structure) --- */}
      <header className="h-screen bg-gradient-to-b from-slate-900 to-slate-700 text-white flex items-center justify-center text-4xl font-bold">
        Scroll Down for Next.js GSAP Examples
      </header>
      {/* Section 1: Simple Trigger */}
      <section className="min-h-[50vh] py-20 px-4 flex items-center justify-center bg-gray-100">
        <div
          ref={simpleTriggerRef}
          className="w-1/2 p-10 bg-white shadow-lg rounded"
        >
          <h2 className="text-2xl font-semibold mb-4">1. Simple Trigger</h2>
        </div>
      </section>
      {/* Section 2: Scrub Animation */}
      <section className="min-h-[70vh] py-20 px-4 flex flex-col items-center justify-center bg-teal-50">
        <h2 className="text-2xl font-semibold mb-10">2. Scrub Animation</h2>
        <div
          ref={scrubRef}
          className="w-32 h-32 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold"
        >
          Scrub
        </div>
      </section>
      {/* Section 3: Pinning */}
      <section className="py-10 bg-gray-200">
        <h2 className="text-2xl font-semibold text-center mb-10">3. Pinning</h2>
        <div className="h-40 bg-gray-200"></div>
        <div
          ref={pinSectionRef}
          className="h-screen bg-blue-200 flex items-center justify-center"
        >
          <div
            ref={pinContentRef}
            className="w-1/3 p-8 bg-white shadow-xl rounded text-center"
          >
            <h3 className="text-xl font-bold">Pinned Section</h3>
          </div>
        </div>
        <div className="h-40 bg-gray-200"></div>
      </section>
      {/* Section 4: Batch Processing */}
      <section className="py-20 px-4 bg-purple-50">
        <h2 className="text-2xl font-semibold text-center mb-10">
          4. Batch Processing
        </h2>
        <div
          ref={batchContainerRef}
          className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="batch-item h-40 bg-purple-400 rounded-lg shadow-md flex items-center justify-center text-white font-bold"
            >
              Item {item}
            </div>
          ))}
        </div>
      </section>
      {/* Section 5: Responsive Animation */}
      <section className="min-h-[70vh] py-20 px-4 flex flex-col items-center justify-center bg-yellow-50">
        <h2 className="text-2xl font-semibold mb-10">
          5. Responsive (matchMedia)
        </h2>
        <div
          ref={responsiveRef}
          className="w-40 h-40 bg-yellow-400 rounded-lg flex items-center justify-center text-black font-bold"
        >
          Responsive
        </div>
      </section>

      {/* --- Section 6: Reversed Side Pinning (JSX Structure) --- */}
      <section
        ref={reversedPinSectionRef}
        className="relative flex bg-stone-100 py-10"
      >
        {" "}
        {/* Flex container */}
        <h2 className="absolute top-5 left-1/2 -translate-x-1/2 text-2xl font-semibold z-20">
          6. Pin Steps, Scroll Images
        </h2>
        {/* Left Column (SCROLLING Images) */}
        <div ref={scrollingImageContainerRef} className="w-1/2 px-8 py-16">
          {" "}
          {/* Width 50%, Padding */}
          {/* Image 1 - Needs enough height/margin to act as trigger */}
          <div
            ref={image1Ref}
            className="mb-16 lg:mb-32 min-h-[60vh] flex items-center justify-center"
          >
            <img
              src="https://via.placeholder.com/400x500/ff9999/ffffff?text=Image+1+(Scrolls)"
              alt="Scrolling Image 1"
              className="block max-w-full h-auto rounded shadow-lg"
            />
          </div>
          {/* Image 2 */}
          <div
            ref={image2Ref}
            className="mb-16 lg:mb-32 min-h-[60vh] flex items-center justify-center"
          >
            <img
              src="https://via.placeholder.com/400x500/99ccff/ffffff?text=Image+2+(Scrolls)"
              alt="Scrolling Image 2"
              className="block max-w-full h-auto rounded shadow-lg"
            />
          </div>
          {/* Image 3 */}
          <div
            ref={image3Ref}
            className="min-h-[60vh] flex items-center justify-center pb-16"
          >
            {" "}
            {/* Padding bottom for last image */}
            <img
              src="https://via.placeholder.com/400x500/99ff99/ffffff?text=Image+3+(Scrolls)"
              alt="Scrolling Image 3"
              className="block max-w-full h-auto rounded shadow-lg"
            />
          </div>
        </div>
        {/* Right Column (PINNED Steps) */}
        <div
          ref={pinnedStepsContainerRef}
          className="w-1/2 h-screen flex flex-col items-center justify-center px-10 py-16"
        >
          {" "}
          {/* Width 50%, Height for pin, Flex column center */}
          {/* Container for the steps within the pinned area */}
          <div className="text-center">
            <h3
              ref={step1TextRef}
              className="step-text text-4xl font-bold mb-10 transition-colors duration-300"
            >
              Step 1: View Image 1
            </h3>
            <h3
              ref={step2TextRef}
              className="step-text text-4xl font-bold mb-10 transition-colors duration-300"
            >
              Step 2: Focus on Image 2
            </h3>
            <h3
              ref={step3TextRef}
              className="step-text text-4xl font-bold transition-colors duration-300"
            >
              Step 3: Observe Image 3
            </h3>
          </div>
        </div>
      </section>
      {/* --- End of Section 6 --- */}

      {/* --- Section 7 Svg Scroll Animation --- */}
      <SvgScrollAnimation />

      <TextRevealScroll />

      <footer className="h-60 bg-slate-800 text-white flex items-center justify-center text-xl">
        End of Examples
      </footer>

      {/* Add CSS for the text color change (same as before) */}
      <style jsx global>{`
        .step-text {
          color: #fff; /* Tailwind green-600 */
        }
        .step-text.active-step-text {
          color: #000; /* Tailwind red-600 */
        }
      `}</style>
    </div>
  );
}
