import React from "react";

const Slide = React.forwardRef((props, ref) => {
  return (
    <div className="box" ref={ref}>
      <div className="inner">
        {props.question && (
          <>
            <h3 className="question">{props.question.question}</h3>

            <div className="options">
              {props.question.options.map((option, index) => (
                <div
                  className={`option ${
                    props.selectedOption.slide === props.slide &&
                    props.selectedOption.option === index
                      ? "selected"
                      : ""
                  } ${option.correct ? "correct" : "incorrect"} ${
                    props.selectedOption.option &&
                    option.correct &&
                    props.selectedOption.option !== index
                      ? "flash"
                      : ""
                  }`}
                  onClick={(e) =>
                    props.handleClick(e, index, props.slide, option.correct)
                  }
                  key={index}
                >
                  {option.text}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default Slide;
