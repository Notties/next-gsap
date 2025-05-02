"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export default function ContextSafe() {
  const container = useRef(null);

  const { contextSafe } = useGSAP({ scope: container }); // we can pass in a config object as the 1st parameter to make scoping simple

  // ✅ wrapped in contextSafe() - animation will be cleaned up correctly
  // selector text is scoped properly to the container.
  const onClickGood = contextSafe(() => {
    gsap.to(".good", { rotation: 180 });
  });

  return (
    <div
      ref={container}
      className="flex flex-col items-center justify-center h-screen"
    >
      <button onClick={onClickGood} className="good border">
        this is btn
      </button>
    </div>
  );
}
