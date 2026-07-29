import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function SplashIntro() {
  const [show, setShow] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("hasSeenIntro");
    if (!hasSeen) {
      setShow(true);
      sessionStorage.setItem("hasSeenIntro", "true");
    } else {
      setIsMounted(false);
    }
  }, []);

  if (!isMounted) return null;

  return (
    <AnimatePresence onExitComplete={() => setIsMounted(false)}>
      {show && (
        <motion.div
          key="splash-overlay"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background pointer-events-auto"
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{
            delay: 0.8, // wait for logo bounce + small pause
            duration: 0.7,
            ease: [0.76, 0, 0.24, 1],
          }}
          onAnimationComplete={() => setShow(false)}
        >
          {/* Logo container */}
          <div className="flex-1 flex items-center justify-center w-full">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: [0.9, 1.1, 1], opacity: 1 }}
              transition={{
                duration: 0.55,
                ease: [0.34, 1.56, 0.64, 1],
                delay: 0.1,
              }}
              className="relative flex items-center justify-center"
            >
              <div className="size-32 rounded-full border border-primary/30 bg-card p-4 shadow-2xl flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Prime Modulars"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>

          {/* Wave SVG at the bottom */}
          <svg
            className="absolute top-full left-0 w-full h-[25vh] fill-background"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ overflow: "visible" }}
          >
            <motion.path
              initial={{ d: "M0,0 L100,0 L100,0 Q50,0 0,0 Z" }}
              animate={{
                d: [
                  "M0,0 L100,0 L100,0 Q50,0 0,0 Z",
                  "M0,0 L100,0 L100,100 Q50,180 0,100 Z",
                  "M0,0 L100,0 L100,0 Q50,0 0,0 Z",
                ],
              }}
              transition={{
                delay: 0.8,
                duration: 0.7,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
