import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import './RotatingText.css';

// Dependency-free rotating text. Previously this used Framer Motion to spring
// every character on a perpetual loop — ~40 JS-driven, non-composited layout
// animations firing every few seconds, which dominated mobile main-thread time.
// This version keeps the same staggered "characters slide up" look but drives it
// with pure CSS keyframes on transform/opacity (GPU-composited, zero main-thread
// cost) and removes the entire `motion` dependency from the homepage bundle.

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const RotatingText = forwardRef((props, ref) => {
  const {
    texts,
    rotationInterval = 2000,
    staggerDuration = 0,
    staggerFrom = 'first',
    loop = true,
    auto = true,
    splitBy = 'characters',
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    // Accept and ignore the old motion-only props so existing call sites keep
    // working without changes.
    transition,
    initial,
    animate,
    exit,
    animatePresenceMode,
    animatePresenceInitial,
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(
      typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  const splitIntoCharacters = (text) => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), (s) => s.segment);
    }
    return Array.from(text);
  };

  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex];
    if (splitBy === 'characters') {
      const words = currentText.split(' ');
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1,
      }));
    }
    if (splitBy === 'words') {
      return currentText.split(' ').map((word, i, arr) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1,
      }));
    }
    if (splitBy === 'lines') {
      return currentText.split('\n').map((line, i, arr) => ({
        characters: [line],
        needsSpace: i !== arr.length - 1,
      }));
    }
    return currentText.split(splitBy).map((part, i, arr) => ({
      characters: [part],
      needsSpace: i !== arr.length - 1,
    }));
  }, [texts, currentTextIndex, splitBy]);

  const totalChars = useMemo(
    () => elements.reduce((sum, word) => sum + word.characters.length, 0),
    [elements]
  );

  const getStaggerDelay = useCallback(
    (index) => {
      if (reduced) return 0;
      const total = totalChars;
      if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration;
      if (staggerFrom === 'center') {
        const center = Math.floor(total / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      if (staggerFrom === 'random') {
        const randomIndex = Math.floor(Math.random() * total);
        return Math.abs(randomIndex - index) * staggerDuration;
      }
      if (typeof staggerFrom === 'number') {
        return Math.abs(staggerFrom - index) * staggerDuration;
      }
      return index * staggerDuration;
    },
    [reduced, staggerFrom, staggerDuration, totalChars]
  );

  const handleIndexChange = useCallback(
    (newIndex) => {
      setCurrentTextIndex(newIndex);
      if (onNext) onNext(newIndex);
    },
    [onNext]
  );

  const next = useCallback(() => {
    const nextIndex =
      currentTextIndex === texts.length - 1
        ? loop
          ? 0
          : currentTextIndex
        : currentTextIndex + 1;
    if (nextIndex !== currentTextIndex) handleIndexChange(nextIndex);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const previous = useCallback(() => {
    const prevIndex =
      currentTextIndex === 0
        ? loop
          ? texts.length - 1
          : currentTextIndex
        : currentTextIndex - 1;
    if (prevIndex !== currentTextIndex) handleIndexChange(prevIndex);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const jumpTo = useCallback(
    (index) => {
      const validIndex = Math.max(0, Math.min(index, texts.length - 1));
      if (validIndex !== currentTextIndex) handleIndexChange(validIndex);
    },
    [texts.length, currentTextIndex, handleIndexChange]
  );

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) handleIndexChange(0);
  }, [currentTextIndex, handleIndexChange]);

  useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [
    next,
    previous,
    jumpTo,
    reset,
  ]);

  useEffect(() => {
    if (!auto) return;
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval, auto]);

  let charCounter = 0;

  return (
    <span className={cn('text-rotate', mainClassName)} {...rest}>
      <span className="text-rotate-sr-only">{texts[currentTextIndex]}</span>
      {/* `key` remounts the phrase each cycle so the CSS enter animation replays. */}
      <span key={currentTextIndex} className="text-rotate" aria-hidden="true">
        {elements.map((wordObj, wordIndex) => (
          <span
            key={wordIndex}
            className={cn('text-rotate-word', splitLevelClassName)}
          >
            {wordObj.characters.map((char, charIndex) => {
              const delay = getStaggerDelay(charCounter++);
              return (
                <span
                  key={charIndex}
                  className={cn(
                    'text-rotate-element',
                    !reduced && 'text-rotate-anim',
                    elementLevelClassName
                  )}
                  style={reduced ? undefined : { animationDelay: `${delay}s` }}
                >
                  {char}
                </span>
              );
            })}
            {wordObj.needsSpace && <span className="text-rotate-space"> </span>}
          </span>
        ))}
      </span>
    </span>
  );
});

RotatingText.displayName = 'RotatingText';
export default RotatingText;
