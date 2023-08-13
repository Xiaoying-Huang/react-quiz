import { useEffect, useReducer } from "react";
import Header from "./Header"
import Main from "./Main"
import Loader from "./Loader"
import Error from "./Error"
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import FinishButton from "./FinishButton";
import RestartButton from "./RestartButton";
import Footer from "./Footer";
import Timer from "./Timer";


const initialState = {
  questions: [],
  //'loading', 'error', 'ready', 'active', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondRemaining: null
};
function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: "ready"
      };
    case 'dataFailed':
      return {
        ...state,
        status: "error"
      }
    case 'start':
      return {
        ...state,
        status: 'active',
        secondRemaining: 10 * state.questions.length
      }
    case 'newAnswer':
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points
      }

    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null
      }

    case 'finishQuiz':

      return {
        ...state,
        status: 'finished',
        highscore: state.points >= state.highscore ? state.points : state.highscore
      }

    case 'restart':
      return {
        ...state,
        status: "ready",
        index: 0,
        answer: null,
        points: 0,
      }

    case 'tick':
      return {
        ...state,
        secondRemaining: state.secondRemaining - 1,
        status: state.secondRemaining === 0 ? "finished" : state.status,
      }
    default:
      throw new Error("Action Unknown");
  }
}
function App() {
  const [{ questions, status, index, answer, points, highscore, secondRemaining }, dispatch] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const totalPoints = questions.reduce((total, question) => total + question.points, 0);
  useEffect(function () {
    async function fetchQuestions() {
      try {
        const res = await fetch(`http://localhost:8000/questions`);
        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    }
    fetchQuestions();
  }, [])


  return (
    <><div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === 'active' &&
          <>
            <Progress
              numQuestions={numQuestions}
              index={index}
              points={points}
              totalPoints={totalPoints}
              answer={answer} />
            <Question question={questions[index]} dispatch={dispatch} answer={answer} />
            {answer === null
              ? null
              : index === numQuestions - 1
                ? <FinishButton dispatch={dispatch} />
                : <NextButton dispatch={dispatch} />}
            <Footer>
              <Timer dispatch={dispatch} secondRemaining={secondRemaining} />
            </Footer>
          </>}
        {status === 'finished' &&
          <><FinishScreen points={points} totalPoints={totalPoints} highscore={highscore} /><RestartButton dispatch={dispatch} /></>}
      </Main>
    </div></>
  );
}

export default App;
