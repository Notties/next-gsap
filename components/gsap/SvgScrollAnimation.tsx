// src/components/SvgScrollAnimation.js
"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SvgScrollAnimation() {
  const sectionRef = useRef(null);
  const svgRef = useRef(null);
  // Type assertion ไม่จำเป็น แต่ใส่ไว้ก็ได้
  const checkmarkPathRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const svgElement = svgRef.current;
      const path = checkmarkPathRef.current;

      // Guard clause: Check if both elements exist
      if (!svgElement || !path) {
        console.warn("SVG or Path element not found");
        return;
      }

      // --- Animate SVG Container First ---
      // ทำให้ SVG หมุนและขยายเมื่อ scroll ผ่าน (ควบคุม opacity ที่นี่)
      gsap.from(svgElement, { // ใช้ตัวแปรที่ check null แล้ว
        scale: 0.5,
        rotation: -90,
        opacity: 0, // <<< ให้ SVG เริ่มต้นที่มองไม่เห็น
        ease: "power1.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "70% 80%",
          toggleActions: "play none none reverse",
          id: "svg-transform",
           markers: {startColor: "purple", endColor: "orange"}, // เปิด marker นี้ด้วยเพื่อดู
        },
      });


      // --- SVG Path Drawing Animation ---
      // รอสักครู่เล็กน้อยเพื่อให้แน่ใจว่า SVG แสดงผลแล้วก่อนวัดความยาว (อาจจะไม่จำเป็น แต่ลองดูได้)
      gsap.delayedCall(0.1, () => {
          const pathLength = path.getTotalLength();
          console.log("Calculated Path Length:", pathLength); // <<< Log ค่าดู

          if (pathLength === 0) {
            console.error("Path length is 0. Check if SVG path is rendered correctly.");
            return;
          }

          // 2. ตั้งค่าเริ่มต้นให้ Path "มองไม่เห็น" (ไม่ต้องตั้ง opacity ที่ path แล้ว)
          gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
            opacity: 0,
          });

          // 3. สร้าง Animation ด้วย ScrollTrigger
          gsap.to(path, {
            strokeDashoffset: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "40% 80%",
              end: "60% 80%",
              scrub: 0.5,
              markers: { startColor: "lime", endColor: "red", fontSize: "0.8rem" },
              id: "svg-draw",
              invalidateOnRefresh: true,
            },
          });
      });


    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="min-h-[150vh] py-20 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-black text-white"
    >
      <h2 className="text-3xl font-bold mb-10 text-center">
        7. SVG Scroll Animation
      </h2>
      <p className="mb-16 text-center max-w-xl">
        As you scroll, the checkmark below will be drawn using GSAP...
      </p>
      {/* SVG Container */}
      <div className="w-48 h-48">
        <svg
          ref={svgRef}
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          // style={{ opacity: 0 }} // <<< เอา inline style ออก
        >
          {/* Optional: วงกลมพื้นหลัง */}
          <circle cx="26" cy="26" r="25" stroke="#444" strokeWidth="2" />
          {/* Path ของเครื่องหมายถูก */}
          <path
            ref={checkmarkPathRef}
            d="M14 27 L 22 35 L 38 19"
            stroke="#059669"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            // style={{ opacity: 0 }} // <<< เอา inline style ออก
          />
        </svg>
      </div>
      <div className="h-[50vh]"></div>
    </section>
  );
}