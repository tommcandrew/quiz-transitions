import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import gsap from "gsap";
import Slide from "./Slide";
import questions from "./questions";

const App = () => {
  const [currentBox, setCurrentBox] = useState(0);
  const [numChanges, setNumChanges] = useState(0);
  const [boxAItem, setBoxAItem] = useState(0);
  const [boxBItem, setBoxBItem] = useState(1);
  const [selectedOption, setSelectedOption] = useState({});
  const [, setCorrect] = useState(null);
  const [, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    //should not update after first animation
    if (numChanges === 0) {
      return;
    }
    if (currentBox === 0) {
      setBoxBItem(boxBItem + 2);
    } else {
      setBoxAItem(boxAItem + 2);
    }
    //eslint-disable-next-line
  }, [currentBox]);

  const handleComplete = () => {
    setSelectedOption({});
    setNumChanges(numChanges + 1);
    setCurrentBox(currentBox === 0 ? 1 : 0);
  };

  const boxA = useRef();
  const boxB = useRef();
  const tl1 = useRef(gsap.timeline());

  const refs = {
    0: boxA,
    1: boxB,
  };

  const handleClick = (e, option, slide, correct) => {
    setSelectedOption({ slide, option });
    setCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
    //do nothing is animation is playing
    if (tl1.current.isActive()) {
      return;
    }
    if (numChanges === questions.length - 1) {
      setFinished(true);
      return;
    }
    //make current slide look like it's moving backwards a bit
    tl1.current.to(refs[currentBox].current, 0.2, {
      scale: 0.9,
    });
    //show tick/cross
    tl1.current.to(correct ? ".tick" : ".cross", 0, {
      display: "block",
      scale: 1,
      ease: "linear",
    });
    tl1.current.to(correct ? ".tick" : ".cross", 0.5, {
      scale: 40,
      opacity: 1,
      ease: "linear",
    });
    tl1.current.to(correct ? ".tick" : ".cross", 0.1, {
      opacity: 0,
      display: "none",
    });
    //move current slide out of view to left
    tl1.current.to(
      refs[currentBox].current,
      0.3,
      {
        x: "-=100vw",
        opacity: 0,
      },
      ">+2"
    );
    //then move it to back of queue (far right)
    tl1.current.to(refs[currentBox].current, 0, { x: "+=200vw" });
    //move next slide into view from right
    tl1.current.to(
      refs[currentBox === 0 ? 1 : 0].current,
      0.2,
      {
        x: "-=100vw",
        opacity: 1,
        scale: 1,
        onComplete: handleComplete,
      },
      ">-0.25"
    );
  };

  return (
    <div className="app">
      <div className="progress">
        Question {numChanges + 1}/{questions.length}
      </div>
      <div className="wrapper">
        <Slide
          ref={boxA}
          question={questions[boxAItem]}
          handleClick={handleClick}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          slide={0}
        />
        <Slide
          ref={boxB}
          question={questions[boxBItem]}
          handleClick={handleClick}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          slide={1}
        />
      </div>
      <div className="cross">&times;</div>
      <div className="tick">&#10004;</div>
    </div>
  );
};

export default App;
