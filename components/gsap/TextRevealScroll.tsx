// src/components/TextRevealScrollNew.js <--- ตั้งชื่อใหม่เผื่อทดสอบ

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ลงทะเบียน Plugin (ควรทำครั้งเดียวในโปรเจกต์ แต่ใส่ซ้ำก็ไม่เป็นไร)
gsap.registerPlugin(ScrollTrigger);

export default function TextRevealScroll() {
  const sectionContainerRef = useRef(null); // Ref สำหรับ Section ทั้งหมด
  const theTextRef = useRef(null); // Ref สำหรับ H1 โดยเฉพาะ

  useGSAP(
    () => {
      if (!sectionContainerRef.current || !theTextRef.current) {
        console.warn("TextRevealScrollNew: Refs not ready yet.");
        return;
      }
      console.log(
        "TextRevealScrollNew useGSAP: Setting up FROM-TO animation for",
        theTextRef.current
      );

      // ใช้ gsap.fromTo()
      gsap.fromTo(
        theTextRef.current,
        {
          // ======== FROM Vars (สถานะเริ่มต้น) ========
          opacity: 0,
          x: -50, // translate(-50px, ...)
          y: 200, // translate(..., 300px)
          rotationY: -40, // rotateY(-40deg)
          rotationZ: -10, // rotateZ(-10deg)  (หรือใช้ rotation: -10)
          rotationX: 15, // rotateX(15deg)
          transformOrigin: "center center", // <<< แนะนำ: ใช้ center center สำหรับ transform รวมหลายแกน จะดูสมดุลกว่า "left center"
          // หรือถ้าต้องการ "left center" จริงๆ ก็ใช้ค่าเดิมได้:
          // transformOrigin: "left center",
        },
        {
          // ======== TO Vars (สถานะสิ้นสุด + ScrollTrigger) ========
          opacity: 1, // <<< opacity ปกติสูงสุดคือ 1 (ค่า 2.5 ไม่มีผลทางภาพ)
          x: 50, // translate(50px, ...)
          y: -366.667, // translate(..., -366.667px) <<< ใช้ค่าที่คุณให้มา
          rotationY: 40, // rotateY(40deg)
          rotationZ: 10, // rotateZ(10deg) (หรือใช้ rotation: 10)
          rotationX: -15, // rotateX(-15deg)
          ease: "none", // <<< ใช้ ease "none" สำหรับ scrub จะแม่นยำที่สุด

          // --- ScrollTrigger Config (ใส่ใน TO Vars) ---
          scrollTrigger: {
            trigger: sectionContainerRef.current,
            start: "60% 85%", // <<< ลองเริ่มเมื่อ section แตะขอบบน
            end: "100% center", // <<< ลองให้จบเมื่อ section พ้นขอบล่างไป 200px (ให้มีระยะเยอะๆ)
            // หรือ "bottom top", หรือ "+=1500"
            scrub: 1.5, // ค่า Smoothing (ปรับได้)
            markers: true,
            id: "complex-text-transform", // ID ใหม่
            invalidateOnRefresh: true,
            onEnter: () => console.log("ComplexTransform: Entered"),
            onLeave: () => console.log("ComplexTransform: Left"),
            onUpdate: (self) =>
              console.log(
                "ComplexTransform Progress:",
                self.progress.toFixed(3)
              ),
          },
        }
      ); // สิ้นสุด gsap.fromTo()
    },
    { scope: sectionContainerRef }
  );

  return (
    // Section Container
    <section
      ref={sectionContainerRef}
      className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white py-32 px-6 flex flex-col items-center justify-center overflow-hidden"
    >
      <h2 className="text-2xl font-semibold mb-8 text-center opacity-70">
        Section 8: New Text Reveal
      </h2>

      {/* ข้อความที่จะ Animate */}
      <div ref={theTextRef} className="w-full flex flex-col justify-center">
        {/* Container ช่วยจัดกลาง */}
        <h1
          className="text-6xl sm:text-8xl lg:text-9xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 py-4"
          // สถานะสุดท้ายคือแบบนี้: opacity: 1, transform: translate(0, 0) rotate(0)
        >
          Entra, pega, leva
        </h1>
        <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 py-4">
          +400 produtos disponíveis 24h / 365 dias
        </p>
      </div>

      <p className="mt-16 text-center max-w-lg opacity-80">
        This text should animate up, fade in, and rotate as you scroll through
        this section. Check the markers!
      </p>

      {/* Spacer ด้านล่างเพื่อให้แน่ใจว่ามีพื้นที่ Scroll ออกจากจุด End */}
      <div style={{ height: "60vh" }}></div>
    </section>
  );
}
